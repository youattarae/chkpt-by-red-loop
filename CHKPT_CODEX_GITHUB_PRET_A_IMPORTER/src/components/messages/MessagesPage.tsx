import {useEffect,useRef,useState} from 'react';
import {useStore} from '../../services/store';
import {useNavigation} from '../../navigation/Navigation';
import {PageLayout} from '../navigation/PageLayout';
import {SafeImage} from '../common/SafeImage';
import {fetchWithTimeout} from '../../services/http';
type Peer={id:string;displayName:string;avatarUrl:string};
type Message={id:string;senderId:string;recipientId:string;text:string;createdAt:string};
type Conversation={peer:Peer;last:Message;unread:number};
export function MessagesPage({peerId,isVisible=true}:{peerId?:string;isVisible?:boolean}){
 const {authSessionToken:token,isServerAuthenticated,currentUser}=useStore(),nav=useNavigation();
 const [rows,setRows]=useState<Message[]>([]),[conversations,setConversations]=useState<Conversation[]>([]),[peer,setPeer]=useState<Peer|null>(null),[text,setText]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(true),[sending,setSending]=useState(false),[retry,setRetry]=useState(0);
 const draft=useRef<{text:string;nonce:string}|null>(null),bottom=useRef<HTMLDivElement>(null),busy=useRef(false);
 useEffect(()=>{
  if(!isVisible||!isServerAuthenticated)return;
  let active=true,inFlight=false;let controller:AbortController|undefined;
  const load=async()=>{if(inFlight||document.hidden)return;inFlight=true;controller=new AbortController();const timeout=setTimeout(()=>controller?.abort(),12000);try{
   const response=await fetch('/api/messages'+(peerId?'/'+encodeURIComponent(peerId):''),{headers:{Authorization:`Bearer ${token}`},signal:controller.signal});const data=await response.json();if(!response.ok)throw Error(data.message||'Messagerie indisponible.');
   if(!active)return;
   if(peerId){setPeer(data.peer);setRows(data.messages);await fetch('/api/messages/'+encodeURIComponent(peerId)+'/read',{method:'POST',headers:{Authorization:`Bearer ${token}`},signal:controller.signal});}else setConversations(data.conversations);
   if(active)setError('');
  }catch(e){if(active)setError(e instanceof Error&&e.name!=='AbortError'?e.message:'Connexion interrompue. Réessayez.');}finally{clearTimeout(timeout);inFlight=false;if(active)setLoading(false);}};
  void load();const timer=setInterval(()=>void load(),5000);const visible=()=>void load();document.addEventListener('visibilitychange',visible);
  return()=>{active=false;controller?.abort();clearInterval(timer);document.removeEventListener('visibilitychange',visible);};
 },[token,peerId,isVisible,isServerAuthenticated,retry]);
 useEffect(()=>{if(isVisible)bottom.current?.scrollIntoView({block:'nearest'});},[rows.length,isVisible]);
 const alive=useRef(true);useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 async function send(){if(busy.current||!text.trim())return;busy.current=true;setSending(true);setError('');
  const value=text.trim();if(!draft.current||draft.current.text!==value)draft.current={text:value,nonce:crypto.randomUUID()};
  try{const response=await fetchWithTimeout('/api/messages/'+encodeURIComponent(peerId!),{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({text:value,clientRequestId:draft.current.nonce})});const data=await response.json();if(!response.ok)throw Error(data.message||'Envoi impossible.');if(!alive.current)return;setRows(previous=>previous.some(m=>m.id===data.message.id)?previous:[...previous,data.message]);setText('');draft.current=null;
  }catch(e){if(alive.current)setError(e instanceof Error&&e.name!=='AbortError'?e.message:'Envoi non confirmé. Réessayez : le même message ne sera pas envoyé deux fois.');}finally{busy.current=false;if(alive.current)setSending(false);}
 }
 return <PageLayout title={peer?.displayName||'Messages privés'} onBack={nav.back}>
 {!isServerAuthenticated?<p>Connectez-vous dans Mon compte pour accéder à vos messages.</p>:<>
 <p className="text-xs text-muted">Messages texte privés entre deux profils majeurs publics. Pas de chiffrement de bout en bout dans ce prototype.</p>
 {error&&<div role="alert" className="p-3 rounded-xl bg-soft">{error}<button type="button" onClick={()=>setRetry(n=>n+1)} className="ml-3 underline">Réessayer</button></div>}
 {loading&&<p role="status">Chargement…</p>}
 {!peerId?<><button type="button" onClick={()=>nav.push({page:'search',scope:'all',query:'',filters:{type:'profiles',sort:'name',category:'all',radius:'all'},tab:nav.current.route.tab})} className="rounded-xl p-3 bg-blue-600 text-white font-bold">Trouver un profil</button><p className="text-sm text-muted">Ouvrez un profil et touchez Message pour commencer.</p>{!loading&&!conversations.length&&!error&&<p>Aucune conversation pour le moment.</p>}{conversations.map(c=><button key={c.peer.id} type="button" onClick={()=>nav.push({page:'conversation',id:c.peer.id,tab:nav.current.route.tab})} className="w-full flex gap-3 items-center p-3 rounded-2xl bg-soft text-left"><SafeImage src={c.peer.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover"/><span className="min-w-0 flex-1"><strong className="block">{c.peer.displayName}</strong><span className="block truncate text-sm text-muted">{c.last.text}</span></span>{c.unread>0&&<span aria-label={`${c.unread} non lus`} className="rounded-full bg-rose-900 text-white px-2">{c.unread}</span>}</button>)}</>:peer&&<>
 <button type="button" onClick={()=>nav.push({page:'profile',id:peer.id,tab:nav.current.route.tab})} className="flex items-center gap-3 font-bold"><SafeImage src={peer.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover"/>Voir le profil</button>
 <div aria-label="Conversation" className="space-y-3">{!loading&&!rows.length&&<p>Commencez la conversation.</p>}{rows.map(m=><div key={m.id} className={`max-w-[85%] rounded-2xl p-3 ${m.senderId===currentUser.id?'ml-auto bg-blue-600 text-white':'bg-soft'}`}><p className="whitespace-pre-wrap break-words">{m.text}</p><time className="text-[10px] opacity-75" dateTime={m.createdAt}>{new Date(m.createdAt).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</time></div>)}<div ref={bottom}/></div>
 <form onSubmit={e=>{e.preventDefault();void send();}} className="sticky bottom-24 bg-canvas py-3 space-y-2"><label htmlFor="dm-text" className="text-sm font-bold">Votre message</label><textarea id="dm-text" maxLength={2000} disabled={sending} value={text} onChange={e=>setText(e.target.value)} rows={3} className="w-full rounded-xl border border-line bg-soft p-3"/><div className="flex justify-between items-center"><span className="text-xs text-muted">{text.length}/2 000</span><button type="submit" disabled={sending||!text.trim()} className="bg-blue-600 text-white font-bold rounded-xl px-5 py-3 disabled:opacity-50">{sending?'Envoi…':'Envoyer'}</button></div></form></>}
 </>}
 </PageLayout>;
}
