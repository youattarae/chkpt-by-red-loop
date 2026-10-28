import { SafeImage } from '../common/SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Gamification & 8 Badge Families Official View for CHKPT
 */

import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { 
  Trophy, 
  ArrowLeft, 
  Flame, 
  Compass, 
  Utensils, 
  Palette, 
  CalendarCheck, 
  Sparkles, 
  Camera, 
  Map, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';

interface BadgesViewProps {
  onBack: () => void;
  embedded?: boolean;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ onBack, embedded = false }) => {
  const { badges, currentUser } = useStore();
  const [family,setFamily] = useState('all');
  const [leaderboardTab, setLeaderboardTab] = useState<'friends' | 'national'>('friends');

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'CalendarCheck': return <CalendarCheck className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Map': return <Map className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  return (
    <div className={embedded ? 'space-y-5' : 'max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-5 pb-24'}>
      
      {/* Back button & Title */}
      {!embedded && <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Retour au profil"
          className="p-2 rounded-xl bg-surface border border-line text-body hover:text-ink cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-ink tracking-tight">
            Badges & Titres d'Abidjan
          </h2>
          <span className="text-xs text-muted">
            {unlockedCount} sur {badges.length} trophées débloqués
          </span>
        </div>
      </div>}

      {/* Gamification Rules Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/60 via-surface to-rose-950/40 border border-amber-900/60 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-600/80 text-amber-400 flex items-center justify-center shrink-0">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            8 Familles Officielles CHKPT
          </h3>
          <p className="text-[11px] text-body mt-0.5 leading-relaxed">
            40 paliers · barème provisoire. Progression calculée côté serveur avec les visites créditées et les preuves admissibles. Le personnage de présentation conserve une progression de départ fictive.
          </p>
        </div>
      </div>

      <div aria-label="Familles de badges" className="flex flex-wrap gap-2">{['all',...new Set(badges.map(badge=>badge.family))].map(item=><button type="button" key={item} aria-pressed={family===item} onClick={()=>setFamily(item)} className={`text-xs rounded-xl px-3 py-2 cursor-pointer ${family===item?'bg-blue-950 text-blue-400':'bg-soft text-muted'}`}>{item==='all'?`Tous (${badges.length})`:item}</button>)}</div>
      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {badges.filter(badge=>family==='all'||badge.family===family).map((badge) => {
          const progressPct = Math.min(100, Math.round((badge.currentCount / badge.requiredCount) * 100));

          return (
            <div
              key={badge.id}
              className={`p-3.5 rounded-3xl border transition-all ${
                badge.isUnlocked
                  ? 'bg-surface border-amber-600/70 shadow-lg shadow-amber-950/20'
                  : 'bg-canvas/60 border-line/80 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  badge.isUnlocked
                    ? 'bg-amber-950 text-amber-400 border border-amber-500'
                    : 'bg-surface text-muted border border-line'
                }`}>
                  {getBadgeIcon(badge.iconName)}
                </div>

                {badge.isUnlocked ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-700 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    <span>Débloqué</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-muted flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>{badge.currentCount}/{badge.requiredCount}</span>
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-ink">{badge.name}</h4>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                {badge.family}
              </span>
              <p className="text-[11px] text-body mt-1 line-clamp-2">
                {badge.description}
              </p>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[9px] text-muted mb-1">
                  <span>Progression</span>
                  <span className="font-mono">{progressPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-soft overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.isUnlocked ? 'bg-amber-400' : 'bg-rose-600'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Preview (Amis / National) */}
      <div className="bg-surface border border-line rounded-3xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            Classement Explorateurs
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setLeaderboardTab('friends')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                leaderboardTab === 'friends' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-muted'
              }`}
            >
              Amis
            </button>
            <button
              onClick={() => setLeaderboardTab('national')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                leaderboardTab === 'national' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-muted'
              }`}
            >
              National
            </button>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-canvas border border-line flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center font-bold text-amber-400">#1</span>
              <SafeImage src="/illustrations/sarah.svg" alt="" className="w-7 h-7 rounded-lg object-cover" />
              <div>
                <span className="font-bold text-ink block">Sarah Diallo</span>
                <span className="text-[10px] text-muted">Cocody · 26 visites</span>
              </div>
            </div>
            <span className="font-bold text-rose-400 font-mono">1 820 XP</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center font-bold text-ink">#2</span>
              <SafeImage src={currentUser.avatarUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
              <div>
                <span className="font-bold text-ink block">{currentUser.displayName} (Vous)</span>
                <span className="text-[10px] text-muted">Cocody · {currentUser.checkinsCount} visites</span>
              </div>
            </div>
            <span className="font-bold text-rose-400 font-mono">{currentUser.xpPoints} XP</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-canvas border border-line flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center font-bold text-muted">#3</span>
              <SafeImage src="/illustrations/admin.svg" alt="" className="w-7 h-7 rounded-lg object-cover" />
              <div>
                <span className="font-bold text-ink block">Amara Koné</span>
                <span className="text-[10px] text-muted">Plateau · 14 visites</span>
              </div>
            </div>
            <span className="font-bold text-muted font-mono">980 XP</span>
          </div>
        </div>
      </div>

    </div>
  );
};
