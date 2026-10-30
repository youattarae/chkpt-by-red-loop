import {createContext,useContext,useEffect,useRef,useState,ReactNode} from 'react';
import {Plus,X,ChevronLeft,ChevronRight,Trash2} from 'lucide-react';
import {useStore} from '../../services/store';
import {SafeImage} from '../common/SafeImage';
import {SafeVideo} from '../common/SafeVideo';
import {PostMediaUploader} from '../common/PostMediaUploader';
import type {PostMedia} from '../../types';
interface Story {id:string;authorId:string;authorName:string;authorAvatar:string;mediaUrl:string;mediaType:'image'|'video';text:string;audience:string;createdAt:string;expiresAt:string}
const StoriesContext=createContext<{stories:Story[];open:(id:string)=>void;create:()=>void}>({stories:[],open:()=>{},create:()=>{}});
function StoryDialog({children,label,onClose}:{children:ReactNode;label:string;onClose:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;dialog.current?.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;previous?.focus();};},[]);
  return <dialog ref={dialog} aria-label={label} onCancel={event=>{event.preventDefault();onClose();}} className="fixed inset-0 m-auto w-full max-w-none h-[100dvh] max-h-none sm:max-w-lg sm:h-[90dvh] p-0 rounded-none sm:rounded-3xl bg-canvas text-ink border border-line backdrop:bg-black/80"><div className="relative h-full overflow-y-auto p-4 pb-8"><button autoFocus type="button" onClick={onClose} aria-label="Fermer les stories" className="absolute right-3 top-3 z-10 p-2 rounded-full bg-surface/90"><X className="w-5 h-5"/></button>{children}</div></dialog>;
}
export function StoriesProvider({children}:{children:ReactNode}){
  const {authSessionToken:token,isServerAuthenticated,currentUser}=useStore();
  const [snapshot,setSnapshot]=useState<{token:string;stories:Story[]}>({token:'',stories:[]});
  const [view,setView]=useState<{token:string;id:string}|null>(null);
  const [compose,setCompose]=useState<string|null>(null);
  const [error,setError]=useState(''),[busy,setBusy]=useState(false),[mediaBusy,setMediaBusy]=useState(false);
  const [media,setMedia]=useState<PostMedia[]>([]),[text,setText]=useState(''),[audience,setAudience]=useState('public');
  const [now,setNow]=useState(Date.now());const nonce=useRef('');const revision=useRef(0);
  async function refresh(){
    if(!token||!isServerAuthenticated)return;
    const expectedRevision=revision.current;
    try{const response=await fetch('/api/stories',{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});if(!response.ok)throw Error('Stories indisponibles.');const data=await response.json();if(localStorage.getItem('chkpt_session_token')===token&&expectedRevision===revision.current){revision.current++;setSnapshot({token,stories:data.stories});}}
    catch{/* Keep the last authenticated snapshot; its expiry is still enforced below. */}
  }
  useEffect(()=>{void refresh();const timer=setInterval(()=>{if(document.visibilityState==='visible')void refresh();},5000);const focus=()=>void refresh();window.addEventListener('focus',focus);return()=>{clearInterval(timer);window.removeEventListener('focus',focus);};},[token,isServerAuthenticated]);
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
  const stories=snapshot.token===token&&isServerAuthenticated?snapshot.stories.filter(story=>Date.parse(story.expiresAt)>now):[];
  const story=view?.token===token?stories.find(story=>story.id===view.id):undefined;
  const group=story?stories.filter(item=>item.authorId===story.authorId):[];const index=group.findIndex(item=>item.id===story?.id);
  function create(){setError('');setMedia([]);setText('');setAudience(currentUser.visibility==='private'?'private':'public');nonce.current=Array.from(crypto.getRandomValues(new Uint8Array(16)),byte=>byte.toString(16).padStart(2,'0')).join('');setCompose(token);}
  async function publish(){
    if(!media.length||mediaBusy||busy)return;setBusy(true);setError('');
    try{const response=await fetch('/api/stories',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({mediaUrl:media[0].url,text,audience,clientRequestId:nonce.current})});const body=await response.json();if(!response.ok)throw Error(body.message||'Story non confirmée. Réessayez.');if(localStorage.getItem('chkpt_session_token')!==token)return;revision.current++;setSnapshot(previous=>({token,stories:[...(previous.token===token?previous.stories:[]).filter(item=>item.id!==body.story.id),body.story]}));setCompose(null);}
    catch(error){setError(error instanceof Error?error.message:'Story non confirmée.');}finally{setBusy(false);}
  }
  async function remove(){if(!story||busy)return;setBusy(true);setError('');try{const response=await fetch('/api/stories/'+encodeURIComponent(story.id),{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});if(!response.ok)throw Error('Suppression non confirmée.');revision.current++;setSnapshot(previous=>({...previous,stories:previous.stories.filter(item=>item.id!==story.id)}));setView(null);}catch(error){setError(error instanceof Error?error.message:'Suppression impossible.');}finally{setBusy(false);}}
  return <StoriesContext.Provider value={{stories,open:id=>{setError('');setView({token,id});},create}}>{children}
    {compose===token&&compose!==null&&<StoryDialog label="Ajouter une story" onClose={()=>{if(!busy&&!mediaBusy)setCompose(null);}}>
      <h2 className="font-extrabold text-xl pr-10">Votre story</h2><p className="text-xs text-muted my-3">Une image ou une vidéo · visible pendant 24 h · démonstration.</p>
      {!token||!isServerAuthenticated?<p role="status">Connectez-vous dans Gérer mon compte pour ajouter une story.</p>:<><PostMediaUploader disabled={busy} key={nonce.current} value={media} onChange={setMedia} onBusy={setMediaBusy} maxCount={1} privateUpload/>
      <label className="block text-sm my-4">Texte facultatif<textarea maxLength={1000} value={text} onChange={event=>setText(event.target.value)} className="block p-3 mt-2 w-full rounded-xl border border-line bg-surface"/></label>
      <label className="block text-sm my-4">Visibilité<select value={audience} onChange={event=>setAudience(event.target.value)} disabled={currentUser.visibility==='private'||(currentUser.age??18)<18} className="block p-3 mt-2 w-full rounded-xl border border-line bg-surface"><option value="public">Public</option><option value="followers">Abonnés</option><option value="private">Moi seul</option></select></label>
      <button type="button" onClick={publish} disabled={busy||mediaBusy||!media.length} className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-40">{busy?'Publication…':'Publier la story'}</button></>}
      {error&&<p role="alert" className="text-rose-500 text-sm mt-3">{error}</p>}
    </StoryDialog>}
    {story&&<StoryDialog label={`Stories de ${story.authorName}`} onClose={()=>setView(null)}>
      <p className="font-bold pr-10">{story.authorName}</p><p className="text-xs text-muted mt-1">{index+1}/{group.length} · expire dans {Math.min(24,Math.max(1,Math.ceil((Date.parse(story.expiresAt)-now)/3600000)))} h · {story.audience==='private'?'Moi seul':story.audience==='followers'?'Abonnés':'Public'}</p>
      <div className="my-4 rounded-2xl overflow-hidden">{story.mediaType==='video'?<SafeVideo key={story.id} src={story.mediaUrl}/>:<SafeImage src={story.mediaUrl} alt="Image de la story" className="w-full max-h-[65dvh] object-contain bg-black"/>}</div>
      <p className="whitespace-pre-wrap break-words text-sm">{story.text}</p><p className="text-[10px] text-muted mt-3">Story de démonstration · aucune preuve de visite ni XP.</p>
      <div className="flex justify-between mt-4"><button type="button" aria-label="Story précédente" disabled={index<=0} onClick={()=>setView({token,id:group[index-1].id})} className="p-3 disabled:opacity-30"><ChevronLeft/></button><button type="button" aria-label="Story suivante" disabled={index>=group.length-1} onClick={()=>setView({token,id:group[index+1].id})} className="p-3 disabled:opacity-30"><ChevronRight/></button></div>
      {story.authorId===currentUser.id&&<button type="button" disabled={busy} onClick={remove} className="flex gap-2 items-center text-rose-500 text-sm p-3"><Trash2 className="w-4 h-4"/>Supprimer cette story</button>}
      {error&&<p role="alert">{error}</p>}
    </StoryDialog>}
  </StoriesContext.Provider>;
}
export function StoryAvatar({id,name,src,own=false,onProfile,className='w-10 h-10'}:{id:string;name:string;src:string;own?:boolean;onProfile?:()=>void;className?:string}){
  const {stories,open,create}=useContext(StoriesContext);const active=stories.filter(story=>story.authorId===id);
  return <div className="relative shrink-0"><button type="button" aria-label={active.length?`Voir les stories de ${name}`:`Voir le profil de ${name}`} onClick={()=>active.length?open(active[0].id):onProfile?.()} className={`rounded-full p-1 ${active.length?'bg-gradient-to-tr from-blue-500 via-purple-500 to-rose-500':'bg-soft'}`}><SafeImage src={src} alt="" className={`${className} rounded-full object-cover border-2 border-surface`}/></button>{own&&<button type="button" onClick={create} aria-label="Ajouter une story" className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 text-white p-1 border-2 border-surface"><Plus className="w-4 h-4"/></button>}</div>;
}
export function StoryStrip(){const {stories}=useContext(StoriesContext);const {currentUser}=useStore();const authors=Array.from(new Map(stories.filter(story=>story.authorId!==currentUser.id).map(story=>[story.authorId,story])).values());return <section aria-label="Stories" className="flex gap-4 overflow-x-auto py-3"><div className="shrink-0 text-center"><StoryAvatar id={currentUser.id} name={currentUser.displayName} src={currentUser.avatarUrl} own onProfile={()=>window.dispatchEvent(new CustomEvent('chkpt:profile',{detail:currentUser.id}))}/><p className="text-[10px] mt-1">Votre story</p></div>{authors.map(story=><div key={story.authorId} className="shrink-0 text-center max-w-20"><StoryAvatar id={story.authorId} name={story.authorName} src={story.authorAvatar}/><p className="text-[10px] mt-1 truncate">{story.authorName}</p></div>)}</section>;}
