import { useState } from 'react';
import { ArrowLeft, BarChart3, MapPin, Bookmark, Camera } from 'lucide-react';
import { useStore } from '../../services/store';
import { SafeImage } from '../common/SafeImage';
import { publicationImage } from '../../data/publicationMedia';
// Explicit static scenario, never derived from another user's private visit history.
const examples: Record<string, { visits: number; saves: number; posts: number; trend: number[] }> = {
  plc_maquis_etoile: { visits: 48, saves: 21, posts: 12, trend: [4, 8, 5, 11, 7, 9, 4] },
  plc_cocody_lounge: { visits: 35, saves: 16, posts: 9, trend: [3, 4, 6, 5, 8, 5, 4] },
};
export function BusinessPreview({ onClose }: { onClose: () => void }) {
  const { places } = useStore();
  const [selected, setSelected] = useState('plc_maquis_etoile');
  const place = places.find(place => place.id === selected)!;
  const stats = examples[selected];
  return <section aria-label="Aperçu établissement" className="max-w-2xl mx-auto p-4 pb-28 space-y-5">
    <button type="button" onClick={onClose} className="flex gap-2 text-sm text-muted py-2 cursor-pointer"><ArrowLeft className="w-4 h-4" />Retour au profil</button>
    <div><p className="text-xs font-bold text-blue-400 uppercase">Espace établissement · aperçu</p><h1 className="text-2xl font-extrabold mt-2">Comprendre ce qui attire vos visiteurs</h1></div>
    <p className="text-xs text-body bg-soft border border-line rounded-xl p-3">Toutes les statistiques ci-dessous sont fictives, pour illustrer l’intérêt de CHKPT. Aucune activité réelle, identité de visiteur ou donnée d’historique privé n’est affichée.</p>
    <label className="text-xs font-bold block">Établissement de démonstration<select value={selected} onChange={event => setSelected(event.target.value)} className="block w-full mt-2 rounded-xl bg-surface border border-line text-ink p-3 text-sm">{places.filter(place => examples[place.id]).map(place => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label>
    <div className="flex gap-3 items-center"><SafeImage src={publicationImage(place.coverImage)} alt="" className="w-20 h-20 object-cover rounded-2xl" /><div><h2 className="text-sm font-bold">{place.name}</h2><p className="text-xs text-muted">{place.categoryLabel} · {place.commune}</p></div></div>
    <p className="text-xs text-muted">Exemple sur 7 jours · chiffres inventés</p>
    <div className="grid grid-cols-3 gap-2">{[{label:'Visites',value:stats.visits,Icon:MapPin},{label:'Enregistrements',value:stats.saves,Icon:Bookmark},{label:'Publications',value:stats.posts,Icon:Camera}].map(item => <div key={item.label} className="bg-soft rounded-2xl p-3 min-w-0"><item.Icon className="w-5 h-5 text-blue-400" /><strong className="block text-2xl mt-2">{item.value}</strong><p className="text-[10px] text-muted break-words">{item.label}</p></div>)}</div>
    <section aria-label="Visites fictives sur sept jours" className="bg-soft p-4 rounded-2xl space-y-4"><h3 className="text-sm font-bold flex gap-2"><BarChart3 className="w-4 h-4" />Visites fictives par jour</h3><div className="grid grid-cols-7 gap-2 items-end h-36">{stats.trend.map((value,index) => <div key={index} className="text-center text-[10px] text-muted"><span>{value}</span><div className="bg-blue-600 rounded-t-lg mt-1" style={{height: value*7}} /><span>{['L','M','M','J','V','S','D'][index]}</span></div>)}</div></section>
    <p className="text-sm text-body">L’objectif : relier découvertes, visites et visibilité locale. Ce prototype ne vend aucun abonnement et n’offre pas encore de tableau de bord commerçant en production.</p>
  </section>;
}
