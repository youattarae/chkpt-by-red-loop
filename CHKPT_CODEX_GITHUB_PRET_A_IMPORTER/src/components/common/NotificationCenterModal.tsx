import { SafeImage } from './SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Notification Center & Preferences Modal (Section 13)
 */

import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { 
  Bell, 
  X, 
  Settings, 
  Check, 
  CheckCheck, 
  Moon, 
  ShieldAlert, 
  Clock, 
  Send
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    notificationPreferences,
    updateNotificationPreferences,
    simulateFriendCheckinNotification,
    simulateNearbyEventNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState<'list' | 'preferences'>('list');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-soft text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink tracking-tight">Notifications</h3>
              <p className="text-[11px] text-muted">Plafond contractuel max 3/semaine</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab(activeTab === 'list' ? 'preferences' : 'list')}
              className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'preferences'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'text-muted hover:text-ink hover:bg-soft'
              }`}
              title="Préférences & Heures calmes"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted hover:text-ink rounded-xl hover:bg-soft transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Notification History */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
            
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-muted">
                {notifications.length} notification{notifications.length > 1 ? 's' : ''}
              </span>
              {notifications.some(n => !n.isRead) && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Tout marquer comme lu</span>
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12 text-muted text-xs">
                Aucune notification pour le moment.
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-3 rounded-2xl border text-left transition-colors flex items-start gap-3 cursor-pointer ${
                      notif.isRead
                        ? 'bg-canvas/40 border-line/60 opacity-80'
                        : 'bg-canvas border-line ring-1 ring-rose-500/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-soft border border-line-strong overflow-hidden shrink-0 flex items-center justify-center">
                      {notif.avatarUrl ? (
                        <SafeImage src={notif.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Bell className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-ink truncate">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-muted shrink-0">
                          {notif.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-body mt-0.5 leading-snug">
                        {notif.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Test Simulation Buttons for pitch demo */}
            <div className="pt-3 border-t border-line/80 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                Simuler des événements (Démonstration)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={simulateFriendCheckinNotification}
                  className="py-2 px-2.5 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs text-body flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-emerald-400" />
                  <span>Check-in d'ami</span>
                </button>
                <button
                  type="button"
                  onClick={simulateNearbyEventNotification}
                  className="py-2 px-2.5 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs text-body flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-blue-400" />
                  <span>Événement proche</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Preferences & Contractual Rules */}
        {activeTab === 'preferences' && (
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 text-xs">
            
            {/* Weekly retention cap badge */}
            <div className="p-3 rounded-2xl bg-canvas border border-line flex items-center justify-between">
              <div>
                <span className="font-bold text-ink block">Plafond de rétention</span>
                <span className="text-[11px] text-muted">Maximum contractuel strict</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-800/80 text-rose-300 font-bold">
                {notificationPreferences.weeklyRetentionCount} / {notificationPreferences.maxWeeklyLimit} par semaine
              </div>
            </div>

            {/* Quiet hours */}
            <div className="p-3 rounded-2xl bg-canvas border border-line space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="font-bold text-ink block">Heures calmes</span>
                    <span className="text-[11px] text-muted">Aucune alerte intrusive</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.quietHoursActive}
                  onChange={(e) => updateNotificationPreferences({ quietHoursActive: e.target.checked })}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 text-muted pt-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-muted" />
                <span>Horaires automatiques : 22h00 – 08h00</span>
              </div>
            </div>

            {/* Category Toggles */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                Catégories autorisées
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-line/80 cursor-pointer">
                <span className="text-body">Check-in d'amis autorisés</span>
                <input
                  type="checkbox"
                  checked={notificationPreferences.allowFriendsCheckin}
                  onChange={(e) => updateNotificationPreferences({ allowFriendsCheckin: e.target.checked })}
                  className="w-4 h-4 accent-rose-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-line/80 cursor-pointer">
                <span className="text-body">Événements à proximité (Cocody)</span>
                <input
                  type="checkbox"
                  checked={notificationPreferences.allowNearbyEvents}
                  onChange={(e) => updateNotificationPreferences({ allowNearbyEvents: e.target.checked })}
                  className="w-4 h-4 accent-rose-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-line/80 cursor-pointer">
                <span className="text-body">Progression & Déblocage de badges</span>
                <input
                  type="checkbox"
                  checked={notificationPreferences.allowProgression}
                  onChange={(e) => updateNotificationPreferences({ allowProgression: e.target.checked })}
                  className="w-4 h-4 accent-rose-600 rounded"
                />
              </label>
            </div>

            <button
              onClick={() => setActiveTab('list')}
              className="w-full py-2.5 bg-soft hover:bg-raised text-ink font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Retour aux notifications
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
