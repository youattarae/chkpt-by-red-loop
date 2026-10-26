/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * In-App Notification Toast Component (Section 13)
 */

import React from 'react';
import { useStore } from '../../services/store';
import { Bell, X, Sparkles, MapPin, Calendar, Trophy } from 'lucide-react';

export const InAppNotificationToast: React.FC = () => {
  const { activeToastNotification, dismissToastNotification } = useStore();

  if (!activeToastNotification) return null;

  const getCategoryIcon = () => {
    switch (activeToastNotification.category) {
      case 'friends_checkin':
        return <MapPin className="w-4 h-4 text-emerald-400" />;
      case 'nearby_event':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'progression':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="fixed top-14 left-0 right-0 z-50 px-3 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="w-full max-w-sm bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-3 flex items-start gap-3 pointer-events-auto backdrop-blur-md">
        
        {/* Avatar or Icon */}
        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
          {activeToastNotification.avatarUrl ? (
            <img
              src={activeToastNotification.avatarUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            getCategoryIcon()
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-white truncate">
              {activeToastNotification.title}
            </h4>
            <span className="text-[10px] text-slate-400 shrink-0">À l'instant</span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug line-clamp-2">
            {activeToastNotification.body}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={dismissToastNotification}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
