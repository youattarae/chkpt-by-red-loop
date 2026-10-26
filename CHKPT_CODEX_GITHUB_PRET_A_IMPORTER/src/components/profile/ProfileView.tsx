/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * User Profile & Personal Check-in History View
 */

import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { 
  User, 
  MapPin, 
  Award, 
  Bookmark, 
  ShieldCheck, 
  Clock, 
  Lock, 
  Globe, 
  Users, 
  ChevronRight,
  Sparkles,
  Trophy,
  History
} from 'lucide-react';

interface ProfileViewProps {
  onOpenBadges: () => void;
  onSelectPlace: (placeId: string) => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenBadges,
  onSelectPlace,
  onOpenAuth
}) => {
  const { 
    currentUser, 
    checkins, 
    places, 
    savedPlaceIds, 
    badges, 
    pointsLedger 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'checkins' | 'saved' | 'ledger'>('checkins');

  const unlockedBadges = badges.filter(b => b.isUnlocked);
  const userCheckins = checkins.filter(c => c.userId === currentUser.id);
  const savedPlaces = places.filter(p => savedPlaceIds.includes(p.id));

  // XP level calculation (300 XP / level)
  const currentLevel = currentUser.level;
  const currentXp = currentUser.xpPoints;
  const xpInCurrentLevel = currentXp % 300;
  const progressPct = Math.min(100, Math.round((xpInCurrentLevel / 300) * 100));

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-5 pb-24">
      
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white truncate">
                {currentUser.displayName}
              </h2>
              <button
                onClick={onOpenAuth}
                className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Gérer
              </button>
            </div>

            <span className="text-xs text-slate-400 block mt-0.5">
              @{currentUser.username} · {currentUser.homeZone}
            </span>

            <div className="flex items-center gap-3 text-xs text-slate-300 mt-2 font-medium">
              <span><strong>{currentUser.followersCount}</strong> abonnés</span>
              <span>·</span>
              <span><strong>{currentUser.followingCount}</strong> abonnements</span>
              <span>·</span>
              <span className="text-rose-400"><strong>{currentUser.checkinsCount}</strong> visites</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {currentUser.bio}
        </p>

        {/* Level & XP Gauge */}
        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5 text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Niveau {currentLevel}</span>
            </div>
            <span className="text-rose-400 font-mono">
              {currentXp} XP au total ({xpInCurrentLevel} / 300 XP)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-900 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Badges Preview Banner */}
        <button
          onClick={onOpenBadges}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-900/60 hover:border-amber-700/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-600/80 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Familles de Badges</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                  {unlockedBadges.length} / {badges.length} débloqués
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Explorateur, Foodie, Maquis Master, Culture...
              </span>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </button>

      </div>

      {/* Tabs Filter: Mes Check-ins / Lieux Enregistrés / Journal XP */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('checkins')}
          className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'checkins' ? 'border-rose-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Mes visites ({userCheckins.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'saved' ? 'border-rose-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Favoris ({savedPlaces.length})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'ledger' ? 'border-rose-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Journal XP
        </button>
      </div>

      {/* Content 1: Checkins History */}
      {activeTab === 'checkins' && (
        <div className="space-y-2.5">
          {userCheckins.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              Aucun check-in validé pour le moment.
            </div>
          ) : (
            userCheckins.map((chk) => (
              <div
                key={chk.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    chk.status === 'verified'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{chk.placeName}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(chk.timestamp).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    chk.status === 'verified'
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-rose-950 text-rose-300'
                  }`}>
                    {chk.status === 'verified' ? 'Vérifié ✓' : 'Refusé'}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    {chk.audience === 'private' ? 'Moi seul' : chk.audience === 'followers' ? 'Abonnés' : 'Public'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content 2: Saved Places */}
      {activeTab === 'saved' && (
        <div className="space-y-2.5">
          {savedPlaces.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              Aucun lieu enregistré dans vos favoris.
            </div>
          ) : (
            savedPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place.id)}
                className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={place.coverImage}
                    alt={place.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{place.name}</h4>
                    <span className="text-[11px] text-slate-400 block">
                      {place.neighborhood} ({place.commune})
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))
          )}
        </div>
      )}

      {/* Content 3: Points Ledger Audit Trail */}
      {activeTab === 'ledger' && (
        <div className="space-y-2">
          {pointsLedger.map((entry) => (
            <div
              key={entry.id}
              className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-slate-200 block">{entry.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(entry.timestamp).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <span className="font-bold text-emerald-400 font-mono">
                +{entry.deltaXp} XP
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
