import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useStore } from '../../services/store';
interface Review { id: string; userId: string; authorName: string; rating: number; comment: string; updatedAt: string }
export function ReviewSection({ placeId }: { placeId: string }) {
  const { currentUser, authSessionToken } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/places/${encodeURIComponent(placeId)}/reviews`, { signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => { setReviews(data.reviews); const own = data.reviews.find((review: Review) => review.userId === currentUser.id); if (own) { setRating(own.rating); setComment(own.comment); } setLoaded(true); })
      .catch(() => { if (!controller.signal.aborted) setNotice('Les avis sont indisponibles pour le moment. Réessayez en rouvrant la fiche.'); });
    return () => controller.abort();
  }, [placeId, currentUser.id]);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setNotice('');
    try {
      const response = await fetch(`/api/places/${encodeURIComponent(placeId)}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authSessionToken}` }, body: JSON.stringify({ rating, comment }) });
      if (!response.ok) throw new Error(response.status === 401 ? 'Reconnectez-vous pour publier votre avis.' : 'Avis non enregistré. Vérifiez la note et le commentaire.');
      const refreshed = await fetch(`/api/places/${encodeURIComponent(placeId)}/reviews`);
      if (!refreshed.ok) throw new Error('Avis enregistré. Rouvrez la fiche pour le retrouver.');
      setReviews((await refreshed.json()).reviews); setNotice('Votre avis de démonstration est enregistré.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Avis indisponible.'); }
    finally { setPending(false); }
  }
  const own = reviews.some(review => review.userId === currentUser.id);
  return <section aria-label="Avis sur le lieu" className="border-t border-line pt-5 space-y-4">
    <div><h3 className="text-lg font-bold">Les avis de la communauté</h3><p className="text-xs text-muted mt-1">Avis de démonstration, distincts de la note fictive de la fiche. Aucun achat ni visite certifiée n’est attesté.</p></div>
    {loaded && reviews.length === 0 && <article className="rounded-2xl bg-soft p-4 space-y-2"><p className="text-[10px] font-semibold text-blue-400">Exemple fictif · non comptabilisé</p><h4 className="text-xs font-bold">Camille · personnage fictif</h4><p aria-label="4 étoiles sur 5" className="text-amber-400">★★★★☆</p><p className="text-sm text-body">Une terrasse agréable et une belle ambiance pour une sortie entre amis.</p></article>}
    {reviews.map(review => <article key={review.id} className="rounded-2xl bg-soft p-4 space-y-2"><h4 className="text-xs font-bold">{review.authorName}</h4><p aria-label={`${review.rating} étoiles sur 5`} className="text-amber-400">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</p><p className="text-sm text-body whitespace-pre-line break-words">{review.comment}</p><p className="text-[10px] text-muted">{new Date(review.updatedAt).toLocaleDateString('fr-FR')} · avis de démonstration</p></article>)}
    {!authSessionToken ? <p className="text-xs text-muted">Connectez-vous dans Profil → Gérer mon compte pour laisser un avis.</p>
      : currentUser.visibility === 'private' || (currentUser.age !== undefined && currentUser.age < 18) ? <p className="text-xs text-muted">Les avis publics ne sont pas proposés pour les profils privés dans cette démo.</p>
      : <form onSubmit={submit} className="space-y-3"><h4 className="text-sm font-bold">{own ? 'Modifier mon avis' : 'Laisser un avis'}</h4><fieldset><legend className="text-xs font-semibold mb-2">Votre note</legend><div className="flex gap-2">{[1,2,3,4,5].map(value => <label key={value} className="cursor-pointer rounded-lg p-1 focus-within:ring-2 ring-blue-400"><input type="radio" name={`rating-${placeId}`} value={value} checked={rating === value} onChange={() => setRating(value)} aria-label={`${value} étoile${value > 1 ? 's' : ''}`} className="sr-only" required /><Star aria-hidden="true" className={`w-7 h-7 ${rating >= value ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} /></label>)}</div></fieldset><label className="block text-xs font-semibold">Votre commentaire<textarea value={comment} onChange={event => setComment(event.target.value)} required minLength={3} maxLength={1000} rows={3} placeholder="Qu’avez-vous apprécié dans ce lieu ?" className="block mt-2 p-3 rounded-xl border border-line w-full bg-surface text-ink text-sm" /></label><p className="text-[10px] text-muted">{comment.length}/1 000 · Votre nom et votre avis seront visibles dans cette démo.</p><button type="submit" disabled={pending || rating === 0 || comment.trim().length < 3 || !loaded} className="rounded-xl bg-blue-600 text-white px-4 py-3 text-xs font-bold disabled:opacity-50 cursor-pointer">{pending ? 'Enregistrement…' : own ? 'Mettre à jour mon avis' : 'Publier mon avis'}</button></form>}
    <p role="status" className="text-xs text-muted">{notice}</p>
  </section>;
}
