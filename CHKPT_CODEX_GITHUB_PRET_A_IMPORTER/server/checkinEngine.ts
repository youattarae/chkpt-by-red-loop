/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT by RED LOOP — Server-Side Check-in Engine
 * Calculates geodesic Haversine distance, enforces anti-spoofing,
 * prevents XP duplicate farming via daily idempotency, and records isolated proofs.
 */

import crypto from 'crypto';
import { privateDemoEnabled } from './demoConfig';
import { db, UserEntity, PlaceEntity, CheckInEntity, CheckInProofEntity, Coordinates } from './db';

export const CHECKIN_RADIUS_METERS = 250;

export function calculateDistanceMeters(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface CheckinSubmissionParams {
  user: UserEntity;
  placeId: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  isSimulated?: boolean;
  audience?: 'private' | 'followers' | 'public';
  environment?: 'demo' | 'production';
}

export interface CheckinProcessResult {
  success: boolean;
  status: 'verified' | 'rejected';
  message: string;
  distanceMeters: number;
  awardedXp: number;
  checkIn?: CheckInEntity;
  rejectionReason?: string;
}

export function processCheckinSubmission(params: CheckinSubmissionParams): CheckinProcessResult {
  const { user, placeId, latitude, longitude, accuracyMeters = 15, isSimulated = false, audience = 'private' } = params;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      Math.abs(latitude) > 90 || Math.abs(longitude) > 180 ||
      !Number.isFinite(accuracyMeters) || accuracyMeters < 0) {
    return { success: false, status: 'rejected', message: 'Coordonnées GPS invalides.',
      distanceMeters: 0, awardedXp: 0, rejectionReason: 'invalid_coordinates' };
  }

  // 1. Verify that place exists in certified repository
  const place = db.findPlaceById(placeId);
  if (!place) {
    return {
      success: false,
      status: 'rejected',
      message: 'Lieu introuvable dans le référentiel certifié.',
      distanceMeters: 0,
      awardedXp: 0,
      rejectionReason: 'place_not_found',
    };
  }

  // 2. Compute true geodesic distance on server
  const reportedCoords: Coordinates = { lat: latitude, lng: longitude };
  const distance = calculateDistanceMeters(reportedCoords, place.coordinates);

  // 3. Server policy: only an explicitly enabled private demo accepts declared simulation.
  if (!privateDemoEnabled && isSimulated) {
    return {
      success: false,
      status: 'rejected',
      message: 'Position simulée détectée. En mode production, seul le signal GPS réel est admis.',
      distanceMeters: distance,
      awardedXp: 0,
      rejectionReason: 'simulated_location_forbidden',
    };
  }

  // 4. Verification threshold check (<= 250m)
  if (distance > CHECKIN_RADIUS_METERS) {
    return {
      success: false,
      status: 'rejected',
      message: `Vous êtes trop éloigné du lieu (${distance}m calculés). Le seuil maximal de présence est de ${CHECKIN_RADIUS_METERS}m.`,
      distanceMeters: distance,
      awardedXp: 0,
      rejectionReason: 'distance_exceeded',
    };
  }

  // 5. Daily Idempotency Key: User can only earn XP once per place per calendar day
  const todayKey = new Date().toISOString().split('T')[0];
  const idempotencyKey = `chk_${user.id}_${place.id}_${todayKey}`;

  const existingToday = db.findCheckinByIdempotency(idempotencyKey);
  if (existingToday) {
    return {
      success: false,
      status: 'rejected',
      message: 'Visite déjà validée aujourd\'hui pour cet établissement. Une seule validation journalière est admise.',
      distanceMeters: distance,
      awardedXp: 0,
      rejectionReason: 'duplicate_daily_checkin',
    };
  }

  // 6. Check if this is the first visit ever for this user to this place
  const userCheckins = db.getCheckins(user.id);
  const isFirstVisit = !userCheckins.some(c => c.placeId === place.id && c.status === 'verified');

  // XP Rule: Base 50 XP + 25 XP first discovery bonus
  const awardedXp = isFirstVisit ? 75 : 50;

  const checkinId = `chk_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const nowIso = new Date().toISOString();

  const newCheckin: CheckInEntity = {
    isSimulated,
    id: checkinId,
    userId: user.id,
    userName: user.displayName,
    userAvatar: user.avatarUrl,
    placeId: place.id,
    placeName: place.name,
    placeCategory: place.category,
    timestamp: nowIso,
    status: 'verified',
    audience,
    awardedXp,
    idempotencyKey,
    createdAt: nowIso,
  };

  // Proof Entity: Strictly isolated coordinates and accuracy
  const newProof: CheckInProofEntity = {
    id: `prf_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    checkinId,
    userId: user.id,
    placeId: place.id,
    reportedLat: latitude,
    reportedLng: longitude,
    accuracyMeters,
    calculatedDistanceMeters: distance,
    isSimulated,
    timestamp: nowIso,
    createdAt: nowIso,
  };

  db.createCheckin(newCheckin, newProof, awardedXp);

  return {
    success: true,
    status: 'verified',
    message: isSimulated
      ? `Visite simulée à ${place.name} — données fictives (+${awardedXp} XP).`
      : isFirstVisit
      ? `Présence physique confirmée ! Première découverte de ${place.name} (+${awardedXp} XP).` 
      : `Présence physique confirmée à ${place.name} (+${awardedXp} XP).`,
    distanceMeters: distance,
    awardedXp,
    checkIn: newCheckin,
  };
}
