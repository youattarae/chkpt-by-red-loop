import { MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { useId, useState } from 'react';
import { useStore } from '../../services/store';
import { SafeImage } from '../common/SafeImage';
import { publicationImage } from '../../data/publicationMedia';

export function VisitedPlaces({ onSelectPlace, initialOpen=false }: { onSelectPlace: (id: string) => void; initialOpen?:boolean }) {
  const { currentUser, checkins, places } = useStore();
  const [open, setOpen] = useState(initialOpen);
  const id = useId();
  const visits = checkins.filter(visit => visit.userId === currentUser.id && visit.status === 'verified')
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  const placeIds = [...new Set(visits.map(visit => visit.placeId))];
  return <div className="border border-line rounded-2xl overflow-hidden">
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id} className="flex items-center gap-3 w-full text-left p-3 bg-soft cursor-pointer">
      <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
      <span className="flex-1 min-w-0"><strong className="block text-sm">Historique des lieux visités</strong><span className="text-xs text-muted">{placeIds.length} lieu{placeIds.length > 1 ? 'x' : ''} · {visits.length} check{visits.length > 1 ? 's' : ''} validé{visits.length > 1 ? 's' : ''}</span></span>
      <ChevronDown className={`w-4 h-4 shrink-0 ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <section id={id} aria-label="Historique des lieux visités" className="p-3 space-y-3">
      <p className="text-xs text-muted">Visible uniquement par vous, du plus récent au plus ancien. Les checks refusés n’y figurent pas. Visites enregistrées sur le serveur de démonstration.</p>
      {placeIds.length === 0 && <p className="text-sm text-body py-3">Aucun lieu visité pour le moment. Vos checks validés apparaîtront ici.</p>}
      {placeIds.map(placeId => {
        const entries = visits.filter(visit => visit.placeId === placeId);
        const last = entries[0];
        const place = places.find(item => item.id === placeId);
        const details = <>
          {place && <SafeImage src={publicationImage(place.coverImage)} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />}
          <span className="flex-1 min-w-0 space-y-1"><strong className="block text-xs break-words">{place?.name || last.placeName}</strong>
            {place && <span className="block text-[11px] text-muted">{place.neighborhood} · {place.commune}</span>}
            <span className="block text-[11px] text-muted">Dernière visite : {new Date(last.timestamp).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span className="block text-[10px] text-blue-400">{entries.length} visite{entries.length > 1 ? 's' : ''} · {last.isSimulated ? 'Dernier check simulé · démo' : 'Dernier check vérifié'}</span>
          </span>
          {place && <ChevronRight className="w-4 h-4 text-muted shrink-0" />}
        </>;
        return place ? <button type="button" key={placeId} onClick={() => onSelectPlace(placeId)} className="w-full flex items-center gap-3 p-3 text-left rounded-xl bg-surface border border-line cursor-pointer">{details}</button>
          : <div key={placeId} className="flex gap-3 p-3 rounded-xl bg-surface border border-line">{details}</div>;
      })}
    </section>}
  </div>;
}
