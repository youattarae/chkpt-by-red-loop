import {StoryAvatar} from '../stories/Stories';
import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, MapPin, Lock, CheckCircle2 } from 'lucide-react';
import { Post } from '../../types';
import { useStore } from '../../services/store';
import { SafeImage } from './SafeImage';
import { SafeVideo } from './SafeVideo';
import { publicationImage, isGeneratedPublicationImage } from '../../data/publicationMedia';

export function PublicationCard({ post, onSelectPlace }: { post: Post; onSelectPlace: (id: string) => void }) {
  const { likePost, addComment, savedPlaceIds, toggleSavePlace, places } = useStore();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [mediaFallback, setMediaFallback] = useState(false);
  const image = publicationImage(post.mediaUrl);
  const attachments=post.media?.length?post.media:(image?[{url:image,type:'image' as const}]:[]);
  const saved = !!post.linkedPlaceId && savedPlaceIds.includes(post.linkedPlaceId);
  const place = places.find(item => item.id === post.linkedPlaceId);
  return <article className="publication-card bg-surface border border-line/70 rounded-3xl overflow-hidden shadow-sm">
    <header className="p-4 flex items-start gap-3">
      <StoryAvatar id={post.authorId} name={post.authorName} src={post.authorAvatar} onProfile={()=>window.dispatchEvent(new CustomEvent('chkpt:profile',{detail:post.authorId}))}/>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-ink break-words"><button type="button" onClick={() => window.dispatchEvent(new CustomEvent('chkpt:profile', { detail: post.authorId }))} className="text-left cursor-pointer">{post.authorName}</button></h3>
        <p className="text-[11px] text-muted break-words"><span>@{post.authorUsername}</span><span aria-hidden="true"> · </span><span>{Number.isFinite(Date.parse(post.createdAt))?new Date(post.createdAt).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):post.createdAt}</span></p>
      </div>
      {post.audience !== 'public' && <span className="text-[10px] text-muted flex items-center gap-1 shrink-0"><Lock className="w-3 h-3" />{post.audience === 'private' ? 'Moi seul' : 'Abonnés'}</span>}
    </header>
    <p className="px-4 pb-3 text-sm text-body leading-relaxed whitespace-pre-line break-words">{post.text}</p>
    {attachments.length>0 && <div className={`mx-3 grid gap-2 ${attachments.length>1?'grid-cols-2':''}`}>{attachments.map((item,index)=><div key={item.url} className="rounded-2xl overflow-hidden">{item.type==='video'?<SafeVideo src={item.url}/>:<SafeImage src={item.url} onError={()=>setMediaFallback(true)} alt={`${post.linkedPlaceName||'Souvenir de sortie'} · photo ${index+1}`} className="w-full aspect-[3/2] object-cover"/>}</div>)}</div>}
    {attachments.some(item=>item.url.startsWith('/illustrations/'))&&<p className="media-disclosure">Illustration de démonstration · lieu fictif{!mediaFallback&&attachments.some(item=>isGeneratedPublicationImage(item.url))?' · image générée par IA':''}</p>}
    {post.linkedPlaceId && <div className="mx-4 py-3 border-b border-line flex items-center gap-3">
      <button type="button" onClick={() => onSelectPlace(post.linkedPlaceId!)} className="flex-1 min-w-0 flex items-center gap-2.5 text-left cursor-pointer">
        {image ? <SafeImage src={image} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" /> : <MapPin className="w-5 h-5 text-blue-400 shrink-0" />}
        <span className="min-w-0"><span className="block text-xs font-bold text-ink break-words">{post.linkedPlaceName || place?.name}</span><span className="block text-[10px] text-muted mt-1">{place ? `${place.categoryLabel} · ${place.commune}` : 'Lieu de la publication'}</span></span>
      </button>
    </div>}
    {post.isVerifiedVisit && <p className="px-4 pt-3 text-[10px] text-muted flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{post.isSimulated ? 'Check simulé · démonstration' : 'Check enregistré · démonstration'}</p>}
    <div className="px-4 py-3 flex items-center gap-5 text-xs text-muted">
      <button type="button" onClick={() => likePost(post.id)} aria-label="Aimer cette publication" aria-pressed={post.isLikedByCurrentUser}
        className={`inline-flex items-center gap-2 py-1 cursor-pointer ${post.isLikedByCurrentUser ? 'text-rose-400' : 'hover:text-rose-400'}`}>
        <Heart className={`w-5 h-5 ${post.isLikedByCurrentUser ? 'fill-current' : ''}`} /><span>{post.likesCount}</span>
      </button>
      <button type="button" onClick={() => setCommentsOpen(!commentsOpen)} aria-label="Commentaires de cette publication" aria-expanded={commentsOpen}
        className="inline-flex items-center gap-2 py-1 hover:text-blue-400 cursor-pointer"><MessageCircle className="w-5 h-5" /><span>{post.commentsCount}</span></button>
      {post.linkedPlaceId && <button type="button" onClick={() => toggleSavePlace(post.linkedPlaceId!)} aria-label="Enregistrer le lieu de cette publication" aria-pressed={saved}
        className="ml-auto py-1 hover:text-blue-400 cursor-pointer"><Bookmark className={`w-5 h-5 ${saved ? 'text-blue-400 fill-current' : ''}`} /></button>}
    </div>
    {commentsOpen && <div className="border-t border-line bg-soft/50 p-4 space-y-3">
      {post.comments.map(item => <p key={item.id} className="text-xs text-body break-words"><strong className="text-ink">{item.authorName} : </strong><span>{item.text}</span></p>)}
      {post.comments.length === 0 && <p className="text-xs text-muted">Aucun commentaire pour le moment.</p>}
      <form className="flex flex-wrap gap-2" onSubmit={async event => { event.preventDefault(); if (!comment.trim()) return; if(await addComment(post.id, comment))setComment(''); }}>
        <input aria-label="Ton commentaire" value={comment} onChange={event => setComment(event.target.value)} placeholder="Ajouter un commentaire…"
          className="min-w-0 flex-1 bg-surface border border-line rounded-xl p-2 text-xs text-ink" />
        <button type="submit" disabled={!comment.trim()} className="bg-blue-600 text-white rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-40 cursor-pointer">Envoyer</button>
      </form>
    </div>}
  </article>;
}
