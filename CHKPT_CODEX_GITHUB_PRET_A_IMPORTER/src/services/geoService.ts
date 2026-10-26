/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Geolocation & Geodesic Distance Engine for Abidjan
 */

import { Coordinates } from '../types';

export const DEFAULT_CHECKIN_RADIUS_METERS = 250;

export interface SimulatedSpot {
  id: string;
  name: string;
  commune: string;
  coordinates: Coordinates;
  targetPlaceId?: string;
  description: string;
}

/**
 * Standard test locations in Abidjan (Cocody priority)
 * Coordinates match the canonical places in db.ts and mockData.ts
 */
export const ABIDJAN_TEST_LOCATIONS: SimulatedSpot[] = [
  {
    id: 'loc_saint_jean',
    name: "Cocody Saint-Jean (Maquis L'Étoile)",
    commune: 'Cocody',
    coordinates: { lat: 5.3491, lng: -4.0012 },
    targetPlaceId: 'plc_maquis_etoile',
    description: "Positionné devant le Maquis L'Étoile d'Abidjan à Saint-Jean."
  },
  {
    id: 'loc_danga',
    name: 'Cocody Danga (Lagon Bleu Rooftop)',
    commune: 'Cocody',
    coordinates: { lat: 5.3428, lng: -3.9935 },
    targetPlaceId: 'plc_cocody_lounge',
    description: 'Sur le rooftop face à la lagune Ébrié, rue des Jardins.'
  },
  {
    id: 'loc_riviera_3',
    name: "Riviera 3 (L'Atelier Café & Bakery)",
    commune: 'Cocody',
    coordinates: { lat: 5.3615, lng: -3.9688 },
    targetPlaceId: 'plc_cafe_atelier',
    description: "À l'Atelier Café & Bakery, carrefour Jacques Prévert."
  },
  {
    id: 'loc_deux_plateaux',
    name: "Deux-Plateaux Vallons (Galerie d'Art Babi)",
    commune: 'Cocody',
    coordinates: { lat: 5.3582, lng: -3.9984 },
    targetPlaceId: 'plc_galerie_ceci',
    description: "Au Centre d'Art Urbain & Céramique, rue des Jardins Vallons."
  },
  {
    id: 'loc_plateau',
    name: 'Plateau Centre (Le Toit des Affaires)',
    commune: 'Plateau',
    coordinates: { lat: 5.3235, lng: -4.0189 },
    targetPlaceId: 'plc_toit_plateau',
    description: 'Immeuble Horizon au Plateau, face au pont Alassane Ouattara.'
  },
  {
    id: 'loc_marcory',
    name: 'Marcory Zone 4 (Chez Ambroise)',
    commune: 'Marcory',
    coordinates: { lat: 5.2912, lng: -3.9841 },
    targetPlaceId: 'plc_chez_ambroise',
    description: 'Rue Paul Langevin, Zone 4C, Marcory.'
  }
];

/**
 * Calculates geodesic distance between two points using the Haversine formula
 */
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
