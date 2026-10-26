/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT Local Push Notification Engine (Section 13)
 * Enforces:
 *  - Quiet hours (22:00 – 08:00)
 *  - Max 3 retention notifications / week
 *  - Category toggles
 *  - Native Web Notification API + In-App fallback
 */

import { NotificationCategory, NotificationPreferences } from '../types';

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  quietHoursActive: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  allowFriendsCheckin: true,
  allowNearbyEvents: true,
  allowProgression: true,
  allowMarketing: false,
  weeklyRetentionCount: 1, // 1 used this week
  maxWeeklyLimit: 3,
};

export function isCurrentlyInQuietHours(start: string, end: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes > endMinutes) {
    // Over midnight: e.g. 22:00 to 08:00
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

export function canDeliverNotification(
  category: NotificationCategory,
  preferences: NotificationPreferences,
  isEssential: boolean = false
): { allowed: boolean; reason?: string } {
  if (!preferences.enabled) {
    return { allowed: false, reason: 'Notifications désactivées par l\'utilisateur.' };
  }

  // Check category toggle
  if (category === 'friends_checkin' && !preferences.allowFriendsCheckin) {
    return { allowed: false, reason: 'Catégorie check-in d\'amis désactivée.' };
  }
  if (category === 'nearby_event' && !preferences.allowNearbyEvents) {
    return { allowed: false, reason: 'Catégorie événements à proximité désactivée.' };
  }
  if (category === 'progression' && !preferences.allowProgression) {
    return { allowed: false, reason: 'Catégorie progression désactivée.' };
  }
  if (category === 'marketing' && !preferences.allowMarketing) {
    return { allowed: false, reason: 'Catégorie actualités partenaires désactivée.' };
  }

  // Check quiet hours (unless essential)
  if (preferences.quietHoursActive && !isEssential) {
    if (isCurrentlyInQuietHours(preferences.quietHoursStart, preferences.quietHoursEnd)) {
      return { allowed: false, reason: 'Période d\'heures calmes active (22h00 – 08h00).' };
    }
  }

  // Check weekly retention limit (max 3/week)
  if (!isEssential && preferences.weeklyRetentionCount >= preferences.maxWeeklyLimit) {
    return {
      allowed: false,
      reason: `Plafond contractuel atteint (${preferences.weeklyRetentionCount}/${preferences.maxWeeklyLimit} notifications cette semaine).`,
    };
  }

  return { allowed: true };
}

export function triggerNativeNotification(title: string, body: string, iconUrl?: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: iconUrl || '/src/assets/images/chkpt_cocody_lounge_1793017679806.jpg',
      });
    } catch {
      // Ignore background restrictions
    }
  }
}
