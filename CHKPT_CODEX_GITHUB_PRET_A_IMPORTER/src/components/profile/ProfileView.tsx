import {StoryAvatar} from '../stories/Stories';
import { RewardDemo } from '../demo/RewardDemo';
import { VisitedPlaces } from './VisitedPlaces';
import React, { useId, useState } from 'react';
import { MapPin, ChevronRight, Sparkles, UserRound, Settings, Lock, ChevronDown } from 'lucide-react';
import { useStore } from '../../services/store';
import { SafeImage } from '../common/SafeImage';
import { BadgesView } from '../badges/BadgesView';
import { PublicationCard } from '../common/PublicationCard';

interface ProfileViewProps {
  onOpenBadges: () => void;
  onSelectPlace: (placeId: string) => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenBadges, onSelectPlace, onOpenAuth, onOpenSettings }) => {
  const { currentUser, authSessionToken, isServerAuthenticated, checkins, places, savedPlaceIds, badges, pointsLedger, posts } = useStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'badges'>('posts');
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityTab, setActivityTab] = useState<'checkins' | 'ledger'>('checkins');
  const profileId = useId();
  const unlockedBadges = badges.filter(badge => badge.isUnlocked);
  const userCheckins = checkins.filter(checkin => checkin.userId === currentUser.id);
  const savedPlaces = places.filter(place => savedPlaceIds.includes(place.id));
  const myPosts = posts.filter(post => post.authorId === currentUser.id);
  const xpInCurrentLevel = currentUser.xpPoints % 300;
  const progressPct = Math.min(100, Math.round(xpInCurrentLevel / 300 * 100));
  const tabs = [{id: 'posts', label: 'Publications'}, {id: 'saved', label: 'Lieux enregistrés'}, {id: 'badges', label: 'Badges'}] as const;

  if(authSessionToken && !isServerAuthenticated)return <p role="status" className="p-6 text-sm text-muted">Chargement de votre profil…</p>;

  return <div className="profile-social max-w-2xl mx-auto pb-24">
    <section aria-label="Mon profil" className="bg-canvas p-4 sm:p-6 space-y-5">
      <div className="flex items-start gap-4">
        <StoryAvatar id={currentUser.id} name={currentUser.displayName} src={currentUser.avatarUrl} own className="w-20 h-20 sm:w-24 sm:h-24"/>
        <div className="min-w-0 flex-1 pt-1">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-ink leading-tight break-words">{currentUser.displayName}</h1>
            <button type="button" title="Réglages" aria-label="Réglages" onClick={onOpenSettings} className="shrink-0 p-1 rounded-lg text-muted hover:bg-soft cursor-pointer"><Settings className="w-5 h-5" /></button>
          </div>
          <p className="text-xs text-muted mt-1 break-words">@{currentUser.username}</p>
          <p className="text-xs sm:text-sm text-body leading-relaxed mt-2 break-words">{currentUser.bio}</p>
          <p className="text-[11px] text-muted mt-2">{currentUser.homeZone} · {currentUser.followingCount} abonnements</p>
          {currentUser.visibility === 'private' && <span className="inline-flex items-center gap-1 text-[10px] text-muted mt-1"><Lock className="w-3 h-3" />Profil privé</span>}
        </div>
      </div>

      <div aria-label="Statistiques du profil" className="grid grid-cols-3 divide-x divide-line text-center">
        <div className="px-2"><strong className="block text-lg font-extrabold text-ink">{currentUser.checkinsCount}</strong><span className="text-xs text-muted">Checks</span></div>
        <button type="button" onClick={() => setActiveTab('badges')} aria-label="Voir mes badges" className="px-2 hover:text-blue-400 cursor-pointer"><strong className="block text-lg font-extrabold text-ink">{unlockedBadges.length}</strong><span className="text-xs text-muted">Badges</span></button>
        <div className="px-2"><strong className="block text-lg font-extrabold text-ink">{currentUser.followersCount}</strong><span className="text-xs text-muted">Abonnés</span></div>
      </div>

      <button type="button" onClick={onOpenAuth} title="Profil & Compte Démo" className="w-full py-3 rounded-2xl bg-soft hover:bg-raised text-ink font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"><UserRound className="w-4 h-4" />Gérer mon compte</button>

      <VisitedPlaces onSelectPlace={onSelectPlace} />
      <RewardDemo key={currentUser.id} />

      <div className="space-y-2">
        <button type="button" aria-label="Afficher mon activité" onClick={() => setActivityOpen(!activityOpen)} aria-expanded={activityOpen} aria-controls={`${profileId}-activity`}
          className="w-full flex flex-wrap items-center justify-between gap-2 text-xs text-muted cursor-pointer">
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-blue-400" />Niveau {currentUser.level}</span>
          <span className="flex items-center gap-1.5">{currentUser.xpPoints} XP au total<ChevronDown className={`w-3.5 h-3.5 ${activityOpen ? 'rotate-180' : ''}`} /></span>
        </button>
        <div role="progressbar" aria-label="Progression du niveau" aria-valuemin={0} aria-valuemax={300} aria-valuenow={xpInCurrentLevel} className="h-1 rounded-full bg-soft overflow-hidden"><div className="h-full rounded-full bg-blue-600" style={{width: `${progressPct}%`}} /></div>
      </div>

      {activityOpen && <section id={`${profileId}-activity`} aria-label="Mon activité" className="border border-line rounded-2xl p-3 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setActivityTab('checkins')} aria-pressed={activityTab === 'checkins'} className={`text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer ${activityTab === 'checkins' ? 'bg-blue-950 text-blue-400' : 'bg-soft text-muted'}`}>Mes visites ({userCheckins.length})</button>
          <button type="button" onClick={() => setActivityTab('ledger')} aria-pressed={activityTab === 'ledger'} className={`text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer ${activityTab === 'ledger' ? 'bg-blue-950 text-blue-400' : 'bg-soft text-muted'}`}>Journal XP</button>
        </div>
      {/* Content 1: Checkins History */}
      {activityTab === 'checkins' && (
        <div className="space-y-2.5">
          {userCheckins.length === 0 ? (
            <div className="p-8 text-center bg-surface border border-line rounded-3xl text-muted text-xs">
              Aucun check-in validé pour le moment.
            </div>
          ) : (
            userCheckins.map((chk) => (
              <div
                key={chk.id}
                className="p-3.5 bg-surface border border-line rounded-2xl flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    chk.status === 'verified'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 break-words">
                    <h4 className="text-xs font-bold text-ink">{chk.placeName}</h4>
                    <span className="text-[10px] text-muted">
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
                    {chk.status === 'verified' ? (chk.isSimulated ? 'Simulé · démo' : 'Vérifié ✓') : 'Refusé'}
                  </span>
                  <span className="text-[9px] text-muted block mt-0.5">
                    {chk.audience === 'private' ? 'Moi seul' : chk.audience === 'followers' ? 'Abonnés' : 'Public'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content 3: Points Ledger Audit Trail */}
      {activityTab === 'ledger' && (
        <div className="space-y-2">
          {!pointsLedger.some(entry => entry.userId === currentUser.id) && <p className="p-4 text-xs text-muted">Aucun mouvement de points pour le moment.</p>}
          {pointsLedger.filter(entry => entry.userId === currentUser.id).map((entry) => (
            <div
              key={entry.id}
              className="p-3 bg-surface border border-line rounded-2xl flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-body block">{entry.label}</span>
                <span className="text-[10px] text-muted font-mono">
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
      </section>}
    </section>

    <div role="tablist" aria-label="Sections du profil" className="profile-tabs grid grid-cols-3 border-b border-line bg-canvas px-2"
      onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=tab]'));
        const current = buttons.indexOf(event.target as HTMLButtonElement);
        if (current < 0) return;
        event.preventDefault();
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[index].click(); buttons[index].focus();
      }}>
      {tabs.map(tab => <button type="button" key={tab.id} id={`${profileId}-tab-${tab.id}`} role="tab" aria-selected={activeTab === tab.id}
        aria-controls={`${profileId}-panel`} tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => setActiveTab(tab.id)}
        className={`social-tab px-1 py-4 text-xs font-semibold cursor-pointer ${activeTab === tab.id ? 'is-active text-ink' : 'text-muted hover:text-ink'}`}>{tab.label}</button>)}
    </div>

    <div role="tabpanel" id={`${profileId}-panel`} aria-labelledby={`${profileId}-tab-${activeTab}`} className="bg-soft/60 p-3 sm:p-4 min-h-48">
      {activeTab === 'posts' && <section aria-label="Mes publications" className="space-y-3">
        {myPosts.length === 0 ? <p className="bg-surface border border-line rounded-2xl p-6 text-sm text-muted text-center">Tes découvertes apparaîtront ici après ta première publication.</p>
          : myPosts.map(post => <PublicationCard key={post.id} post={post} onSelectPlace={onSelectPlace} />)}
      </section>}
      {activeTab === 'saved' && <section aria-label="Mes lieux enregistrés" className="space-y-3">
        {savedPlaces.length === 0 ? <p className="bg-surface border border-line rounded-2xl p-6 text-sm text-muted text-center">Aucun lieu enregistré pour le moment.</p>
          : savedPlaces.map(place => <button type="button" key={place.id} onClick={() => onSelectPlace(place.id)} className="w-full p-3 bg-surface border border-line rounded-2xl flex items-center gap-3 text-left hover:border-line-strong cursor-pointer">
            <SafeImage src={place.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0"><h3 className="text-sm font-bold text-ink break-words">{place.name}</h3><p className="text-xs text-muted mt-1">{place.neighborhood} · {place.commune}</p></div>
            <ChevronRight className="w-4 h-4 text-muted shrink-0" />
          </button>)}
      </section>}
      {activeTab === 'badges' && <section aria-label="Mes badges" className="space-y-4">
        <button type="button" onClick={onOpenBadges} className="text-xs font-bold text-blue-400 cursor-pointer">Ouvrir les familles de badges →</button>
        <BadgesView embedded onBack={() => setActiveTab('posts')} />
      </section>}
    </div>
  </div>;
};
