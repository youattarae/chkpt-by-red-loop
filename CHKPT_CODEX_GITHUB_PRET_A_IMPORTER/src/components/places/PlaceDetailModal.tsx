import { ReviewSection } from './ReviewSection';
import { PlaceShare } from './PlaceShare';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Bookmark, Star, Tag } from 'lucide-react';
import { Place } from '../../types';
import { useStore } from '../../services/store';
import { SafeImage } from '../common/SafeImage';
import { publicationImage, isGeneratedPublicationImage } from '../../data/publicationMedia';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
}

export function PlaceDetailModal({ place, onClose }: PlaceDetailModalProps) {
  const { currentUser, savedPlaceIds, toggleSavePlace } = useStore();
  const [activeImage, setActiveImage] = useState(0);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    if (!place) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [place, onClose]);
  if (!place) return null;
  const images = [...new Set([place.coverImage, ...place.galleryImages].map(source => publicationImage(source)).filter((source): source is string => !!source))];
  const image = images[activeImage] || images[0];
  const saved = savedPlaceIds.includes(place.id);
  return <div className="fixed inset-0 z-50 bg-black/60 flex items-stretch sm:items-center justify-center sm:p-6">
    <section role="dialog" aria-modal="true" aria-labelledby="place-detail-title" className="place-detail bg-canvas text-ink w-full max-w-4xl h-[100dvh] sm:h-[calc(100dvh-3rem)] sm:rounded-3xl shadow-2xl overflow-y-auto overscroll-contain">
      <div className="sticky top-0 z-10 h-0">
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <button type="button" onClick={onClose} aria-label="Fermer la fiche" className="pointer-events-auto p-2.5 bg-black/65 text-white rounded-full cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex gap-2"><PlaceShare place={place} /><button type="button" onClick={() => toggleSavePlace(place.id)} aria-pressed={saved} aria-label={saved ? 'Retirer des favoris' : 'Enregistrer le lieu'} title={saved ? 'Retirer des favoris' : 'Enregistrer le lieu'} className="pointer-events-auto p-2.5 bg-black/65 text-white rounded-full cursor-pointer"><Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} /></button></div>
        </div>
      </div>
      <div className="relative h-[34dvh] min-h-52 sm:h-[40dvh] sm:min-h-64 bg-soft">
        <SafeImage src={image} onError={() => setFallback(true)} alt={`Illustration : ${place.name}`} className="w-full h-full object-cover" />
        <span className="absolute bottom-8 right-4 rounded-full px-2.5 py-1 text-xs font-semibold bg-black/65 text-white">{Math.min(activeImage + 1, images.length)} / {images.length}</span>
      </div>
      <div className="relative -mt-5 rounded-t-3xl bg-canvas p-5 sm:p-7 space-y-5">
        <div className="space-y-2">
          <h2 id="place-detail-title" className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">{place.name}</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-muted"><MapPin className="w-3.5 h-3.5 text-rose-400" />{place.commune} · {place.neighborhood}</span>
            <span className="bg-blue-950 text-blue-400 rounded-lg px-2 py-1 text-[10px] font-semibold">Lieu fictif de démonstration</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {typeof place.rating === 'number' && Number.isFinite(place.rating) && <span className="inline-flex items-center gap-1 text-body"><Star className="w-4 h-4 text-amber-400 fill-current" /><strong>{place.rating.toFixed(1).replace('.', ',')}</strong><span className="text-muted">({place.reviewCount} avis fictifs)</span></span>}
            <span className="bg-rose-950 text-rose-400 rounded-full px-2.5 py-1 font-semibold">{place.categoryLabel}</span>
            <span className="text-body font-semibold">{place.priceDescription}</span>
          </div>
        </div>
        <p className="text-sm text-body leading-relaxed">{place.description}</p>
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
          <div className="bg-soft rounded-2xl p-3 flex items-start gap-2.5"><MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" /><div className="min-w-0"><h3 className="text-xs font-bold">Adresse</h3><p className="text-xs text-body leading-relaxed mt-1 break-words">{place.address}</p></div></div>
          <div className="bg-soft rounded-2xl p-3 flex items-start gap-2.5"><Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" /><div className="min-w-0"><h3 className="text-xs font-bold">Horaires</h3><p className="text-xs text-body leading-relaxed mt-1">{place.openingHours || 'Horaires non renseignés'}</p></div></div>
        </div>
        <div className="flex flex-wrap gap-2">{place.tags.map(tag => <span key={tag} className="inline-flex items-center gap-1.5 bg-soft border border-line rounded-full px-3 py-1.5 text-xs text-body"><Tag className="w-3 h-3" />{tag}</span>)}</div>
        {images.length > 1 && <section aria-label="Illustrations du lieu" className="space-y-2">
          <h3 className="text-sm font-bold">Illustrations du lieu</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">{images.map((source, index) => <button key={source} type="button" aria-label={`Voir l’illustration ${index + 1}`} aria-pressed={activeImage === index} onClick={() => { setActiveImage(index); setFallback(false); }} className={`shrink-0 w-24 h-20 overflow-hidden rounded-xl border-2 cursor-pointer ${activeImage === index ? 'border-blue-400' : 'border-transparent'}`}><SafeImage src={source} alt="" className="w-full h-full object-cover" /></button>)}</div>
        </section>}
        <ReviewSection key={`${place.id}:${currentUser.id}`} placeId={place.id} />
        <div className="border-t border-line pt-4 flex flex-wrap justify-between gap-2 text-xs text-muted"><span>{place.totalCheckins} visites · données fictives</span><span>{!fallback && isGeneratedPublicationImage(image) ? 'Illustration générée par IA' : 'Illustration de présentation'}</span></div>
      </div>
    </section>
  </div>;
}
