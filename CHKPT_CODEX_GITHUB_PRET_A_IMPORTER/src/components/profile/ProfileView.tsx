import {Settings,Lock,UserRound} from 'lucide-react';
import {useStore} from '../../services/store';
import {useNavigation} from '../../navigation/Navigation';
import {StoryAvatar} from '../stories/Stories';
import {PublicationCard} from '../common/PublicationCard';
interface Props {onOpenBadges:()=>void;onSelectPlace:(id:string)=>void;onOpenAuth:()=>void;onOpenSettings:()=>void}
export function ProfileView({onOpenBadges,onSelectPlace,onOpenAuth,onOpenSettings}:Props){
 const {currentUser:user,authSessionToken,isServerAuthenticated,badges,posts}=useStore();const nav=useNavigation();
 if(authSessionToken&&!isServerAuthenticated)return <p role="status" className="p-6">Chargement de votre profil…</p>;
 const mine=posts.filter(post=>post.authorId===user.id);
 return <div className="max-w-2xl mx-auto pb-28"><section aria-label="Mon profil" className="p-4 space-y-3">
 <div className="flex gap-3 items-start"><StoryAvatar id={user.id} name={user.displayName} src={user.avatarUrl} own className="w-16 h-16 sm:w-20 sm:h-20"/><div className="flex-1 min-w-0"><h1 className="text-lg font-extrabold break-words">{user.displayName}</h1><p className="text-xs text-muted break-words">@{user.username}</p><p className="text-xs mt-1 break-words">{user.bio}</p><p className="text-[11px] text-muted mt-1">{user.homeZone}{user.visibility==='private'&&<span className="inline-flex ml-2 gap-1"><Lock className="w-3 h-3"/>Profil privé</span>}</p></div><button type="button" aria-label="Réglages" onClick={onOpenSettings} className="p-3 rounded-xl hover:bg-soft"><Settings className="w-5 h-5"/></button></div>
 {user.avatarUrl.startsWith('/illustrations/profil-')&&<p className="text-[10px] text-muted">Portrait fictif généré par IA · démonstration.</p>}
 <div aria-label="Statistiques du profil" className="grid grid-cols-4 divide-x divide-line text-center text-[11px]"><div><strong className="block text-base">{user.checkinsCount}</strong>Checks</div><button type="button" aria-label="Voir mes badges" onClick={onOpenBadges}><strong className="block text-base">{badges.filter(b=>b.isUnlocked).length}</strong>Badges</button>{(['followers','following'] as const).map(kind=><button type="button" key={kind} onClick={()=>nav.push({page:kind,id:user.id,tab:'profile'})}><strong className="block text-base">{kind==='followers'?user.followersCount:user.followingCount}</strong>{kind==='followers'?'Abonnés':'Abonnements'}</button>)}</div>
 <div className="flex gap-2 items-center"><button type="button" onClick={onOpenAuth} className="flex items-center justify-center gap-2 flex-1 p-2.5 bg-soft rounded-xl text-xs font-bold"><UserRound className="w-4 h-4"/>Gérer mon compte</button>{isServerAuthenticated&&<button type="button" onClick={onOpenBadges} className="p-2 text-xs text-muted"><span>{user.xpPoints} XP au total</span><span className="block text-[10px]">Visible par vous seul</span></button>}</div>
 </section><section aria-label="Mes publications" className="p-3 space-y-3 bg-soft/50"><h2 className="font-bold text-sm">Publications</h2>{mine.length?mine.map(post=><PublicationCard key={post.id} post={post} onSelectPlace={onSelectPlace}/>):<p className="p-4 text-sm text-muted">Vos découvertes apparaîtront ici après votre première publication.</p>}</section></div>;
}
