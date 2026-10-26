/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Domain Entities & Shared Types for CHKPT & RED LOOP
 */

export type Role = 'user' | 'creator' | 'pro' | 'moderator' | 'admin' | 'superadmin';

export type UserVisibility = 'public' | 'private';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  homeZone: string;
  level: number;
  xpPoints: number;
  role: Role;
  age?: number;
  visibility: UserVisibility;
  followersCount: number;
  followingCount: number;
  checkinsCount: number;
  badgesCount?: number;
  createdAt?: string;
}

export type PlaceCategory = 
  | 'restaurants' 
  | 'cafes_boulangeries' 
  | 'bars_lounges' 
  | 'maquis' 
  | 'culture_art' 
  | 'shopping' 
  | 'nature_bienetre' 
  | 'autre';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  categoryLabel: string;
  description: string;
  commune: string;
  neighborhood: string;
  address: string;
  coordinates: Coordinates;
  verificationStatus: 'verified' | 'unverified' | 'pending';
  claimStatus: 'unclaimed' | 'pending' | 'approved' | 'rejected';
  exploitationStatus: 'open' | 'temporarily_closed' | 'permanently_closed';
  priceLevel: '€' | '€€' | '€€€';
  priceDescription: string;
  openingHours?: string;
  isCurrentlyOpen: boolean;
  coverImage: string;
  galleryImages: string[];
  tags: string[];
  totalCheckins: number;
  rating?: number;
  reviewCount: number;
  distance?: number;
  isCertified?: boolean;
}

export type CheckInStatus = 'verified' | 'pending_validation' | 'rejected';
export type CheckInAudience = 'private' | 'followers' | 'public';

export interface CheckIn {
  isSimulated?: boolean;
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  placeId: string;
  placeName: string;
  placeCategory: string;
  timestamp: string;
  status: CheckInStatus;
  audience: CheckInAudience;
  rejectionReason?: string;
  idempotencyKey: string;
  distanceMeters: number;
  gpsAccuracyMeters: number;
  verifiedAt?: string;
  isFirstVisitForUser?: boolean;
  notes?: string;
  mediaUrl?: string;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface Post {
  isSimulated?: boolean;
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  createdAt: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  linkedPlaceId?: string;
  linkedPlaceName?: string;
  linkedCheckinId?: string;
  isVerifiedVisit: boolean;
  audience: CheckInAudience;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  commentsCount: number;
  comments: PostComment[];
}

export interface EventItem {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  utcDate: string;
  locationName: string;
  commune: string;
  description: string;
  coverImage: string;
  priceLabel: string;
  organizerName: string;
  category: string;
  interestedCount: number;
  goingCount: number;
  userIntent?: 'interested' | 'going' | null;
}

export type BadgeFamily = 
  | 'Explorateur' 
  | 'Foodie' 
  | 'Maquis Master' 
  | 'Culture Hunter' 
  | 'Event Hunter' 
  | 'Pionnier' 
  | 'Photographe' 
  | 'Multi-Explorer';

export interface Badge {
  id: string;
  name: string;
  family: BadgeFamily;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  description: string;
  iconName: string;
  requiredCount: number;
  currentCount: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface PointsLedgerEntry {
  id: string;
  userId: string;
  sourceAction: 'CHECKIN_VERIFIED' | 'FIRST_VISIT' | 'POST_PUBLISHED' | 'BADGE_UNLOCKED';
  deltaXp: number;
  timestamp: string;
  referenceId: string;
  label: string;
}

export interface AdCampaign {
  id: string;
  advertiserName: string;
  bannerTitle: string;
  bannerSubtitle: string;
  imageUrl: string;
  ctaText: string;
  isNonClickableNotice: boolean;
  targetCommune?: string;
}

export interface PlaceProposal {
  id: string;
  name: string;
  category: PlaceCategory;
  commune: string;
  address: string;
  landmark: string;
  coordinates: Coordinates;
  contributorId: string;
  contributorName: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string;
}

export interface ModerationCase {
  id: string;
  targetType: 'post' | 'comment' | 'place' | 'user';
  targetId: string;
  targetAuthorName: string;
  reportedReason: string;
  severity: 'low' | 'medium' | 'high';
  snippet: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reportedAt: string;
}

export type NotificationCategory = 'friends_checkin' | 'nearby_event' | 'progression' | 'marketing';

export interface AppNotification {
  id: string;
  recipientId: string;
  category: NotificationCategory;
  title: string;
  body: string;
  targetType?: 'place' | 'event' | 'badge' | 'user' | 'post';
  targetId?: string;
  isRead: boolean;
  createdAt: string;
  avatarUrl?: string;
  dedupeKey?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  quietHoursActive: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string;   // "08:00"
  allowFriendsCheckin: boolean;
  allowNearbyEvents: boolean;
  allowProgression: boolean;
  allowMarketing: boolean;
  weeklyRetentionCount: number;
  maxWeeklyLimit: number; // 3
}
