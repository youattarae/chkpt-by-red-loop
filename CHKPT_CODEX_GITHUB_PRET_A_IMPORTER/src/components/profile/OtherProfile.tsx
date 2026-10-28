import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useStore } from '../../services/store';
import { UserProfile } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { PublicationCard } from '../common/PublicationCard';

type Profile = Pick<UserProfile, 'id' | 'displayName' | 'username' | 'avatarUrl' | 'visibility'> & Partial<Pick<UserProfile, 'bio' | 'homeZone' | 'followersCount' | 'followingCount'>>;
export function OtherProfile({ id, onClose, onSelectPlace }: { id: string; onClose: () => void; onSelectPlace: (id: string) => void }) {
  const { currentUser, authSessionToken, posts, followingIds, setFollowingIds, setCurrentUser } = useStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const active = useRef(true);
  const following = followingIds.includes(id);
  useEffect(() => {
    active.current = true;
    const controller = new AbortController();
    fetch(`/api/profiles/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${authSessionToken}` }, signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error(response.status === 401 ? 'Connectez-vous dans Gérer mon compte pour consulter les profils.' : 'Profil indisponible.'); return response.json(); })
      .then(data => setProfile(data.profile))
      .catch(error => { if (!controller.signal.aborted) setError(error.message); });
    return () => { active.current = false; controller.abort(); };
  }, [id, authSessionToken]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && !document.querySelector('.place-detail')) onClose(); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);
  async function toggleFollow() {
    setPending(true); setError('');
    try {
      const response = await fetch(`/api/profiles/${encodeURIComponent(id)}/follow`, { method: 'POST', headers: { Authorization: `Bearer ${authSessionToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ following: !following }) });
      if (!response.ok) throw new Error('Le suivi n’a pas pu être modifié. Réessayez.');
      const data = await response.json();
      if (!active.current) return;
      setFollowingIds(data.followingIds);
      setCurrentUser(user => user.id === currentUser.id ? { ...user, followingCount: data.followingCount } : user);
      setProfile(profile => profile ? { ...profile, followersCount: data.followersCount } : null);
    } catch (error) { if (active.current) setError(error instanceof Error ? error.message : 'Suivi indisponible.'); }
    finally { if (active.current) setPending(false); }
  }
  const visiblePosts = profile?.visibility === 'public' ? posts.filter(post => post.authorId === id && (post.audience === 'public' || (post.audience === 'followers' && following))) : [];
  return <section role="dialog" aria-modal="true" aria-label="Profil de la communauté" className="fixed inset-0 z-40 bg-canvas overflow-y-auto text-ink">
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-5">
      <button type="button" autoFocus onClick={onClose} className="flex items-center gap-2 py-2 text-sm text-muted cursor-pointer"><ArrowLeft className="w-5 h-5" />Retour</button>
      {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
      {!profile && !error && <p role="status">Chargement du profil…</p>}
      {profile && <>
        <div className="flex gap-4 items-center"><SafeImage src={profile.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover" /><div className="min-w-0"><h1 className="text-xl font-extrabold break-words">{profile.displayName}</h1><p className="text-xs text-muted">@{profile.username}</p></div></div>
        {profile.visibility === 'private' ? <p className="flex items-center gap-2 bg-soft rounded-2xl p-4 text-sm"><Lock className="w-5 h-5 shrink-0" />Profil privé. Ses publications ne sont pas accessibles dans cette démo.</p> : <>
          <p className="text-sm text-body">{profile.bio}</p><p className="text-xs text-muted">{profile.homeZone} · {profile.followersCount} abonnés · {profile.followingCount} abonnements · compteurs de démonstration</p>
          <button type="button" disabled={pending} aria-pressed={following} onClick={toggleFollow} className="w-full p-3 rounded-xl bg-blue-600 text-white font-bold text-sm disabled:opacity-50 cursor-pointer">{pending ? 'En cours…' : following ? 'Ne plus suivre' : 'Suivre'}</button>
          <h2 className="text-sm font-bold">Publications</h2><div className="space-y-3">{visiblePosts.length ? visiblePosts.map(post => <PublicationCard key={post.id} post={post} onSelectPlace={onSelectPlace} />) : <p className="text-sm text-muted">Aucune publication accessible pour le moment.</p>}</div>
        </>}
      </>}
    </div>
  </section>;
}
