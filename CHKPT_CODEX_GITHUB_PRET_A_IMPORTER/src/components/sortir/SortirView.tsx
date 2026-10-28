import { calculateDistanceMeters } from '../../services/geoService';
import { publicationImage } from '../../data/publicationMedia';
import { SafeImage } from '../common/SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Sortir & Agenda Culturel Abidjan with Gemini 3.8 Flash Google Maps Grounding
 */

import React, { useState } from 'react';
import { useStore } from '../../services/store';
import {
  Compass,
  Calendar,
  MapPin,
  Search,
  Sparkles,
  Check,
  CheckCheck,
  ExternalLink,
  ChevronRight,
  Flame,
  Coffee,
  Palette,
  Loader2
} from 'lucide-react';

interface SortirViewProps {
  onSelectPlace: (placeId: string) => void;
}

export const SortirView: React.FC<SortirViewProps> = ({ onSelectPlace }) => {
  const {
    places,
    events,
    toggleEventIntent,
    adCampaigns,
    selectedZone,
    userCurrentCoordinates, activeLocationMode, locationReady
  } = useStore();

  const [category, setCategory] = useState('all');
  const [radius, setRadius] = useState('all');
  const [localQuery, setLocalQuery] = useState('');
  const filtering = category !== 'all' || radius !== 'all' || !!localQuery.trim();
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filteredPlaces = places.map(place => ({ ...place, distance: locationReady ? calculateDistanceMeters(userCurrentCoordinates, place.coordinates) : undefined }))
    .filter(place => {
      const club = /club|discoth[eè]que/i.test(place.categoryLabel + ' ' + place.tags.join(' '));
      return (category === 'all' || (category === 'clubs' ? club : category === 'bars' ? place.category === 'bars_lounges' && !club : place.category === category))
        && (radius === 'all' || (place.distance !== undefined && place.distance <= Number(radius)))
        && normalize(`${place.name} ${place.commune} ${place.categoryLabel}`).includes(normalize(localQuery).trim());
    }).sort((a,b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

  const [groundingQuery, setGroundingQuery] = useState('');
  const [isSearchingGrounding, setIsSearchingGrounding] = useState(false);
  const [groundingResult, setGroundingResult] = useState<{
    text: string;
    groundedPlaces: Array<{ uri: string; title: string }>;
  } | null>(null);

  const handleSearchGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groundingQuery.trim()) return;

    setIsSearchingGrounding(true);
    setGroundingResult(null);

    try {
      const res = await fetch('/api/places/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: groundingQuery.trim(),
          latitude: userCurrentCoordinates.lat,
          longitude: userCurrentCoordinates.lng,
        }),
      });

      const data = await res.json();
      if (!res.ok || typeof data.text !== 'string' || !Array.isArray(data.groundedPlaces)) throw new Error('Recherche indisponible');
      setGroundingResult(data);
    } catch {
      setGroundingResult({
        text: 'La recherche externe est indisponible. Les sélections fictives ci-dessous restent accessibles.',
        groundedPlaces: [],
      });
    } finally {
      setIsSearchingGrounding(false);
    }
  };

  const rooftops = filteredPlaces.filter(p => p.category === 'bars_lounges');
  const maquis = filteredPlaces.filter(p => p.category === 'maquis');
  const cafes = places.filter(p => p.category === 'cafes_boulangeries');

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-6 pb-24">

      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-950/80 via-surface to-rose-950/60 border border-line">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Guide & Sorties · {selectedZone}</span>
        </div>
        <h2 className="text-base font-extrabold text-ink tracking-tight">
          L'Agenda & Les Bonnes Adresses
        </h2>
        <p className="text-xs text-body mt-1">
          Une sélection fictive pour imaginer vos prochaines sorties à Cocody.
        </p>
      </div>

      <section aria-label="Filtres des sorties" className="bg-surface border border-line rounded-3xl p-4 space-y-3">
        <h3 className="text-sm font-bold">Trouver une adresse</h3>
        <label className="block text-xs font-semibold">Nom ou commune<input type="search" value={localQuery} onChange={event => setLocalQuery(event.target.value)} placeholder="Un lieu, une commune…" className="block w-full mt-1 p-3 rounded-xl border border-line bg-canvas text-sm" /></label>
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
          <label className="text-xs font-semibold">Catégorie de sortie<select value={category} onChange={event => setCategory(event.target.value)} className="block w-full mt-1 p-3 rounded-xl border border-line bg-canvas text-sm"><option value="all">Toutes les catégories</option><option value="bars">Bars</option><option value="restaurants">Restaurants</option><option value="clubs">Clubs</option><option value="maquis">Maquis</option><option value="cafes_boulangeries">Cafés</option><option value="culture_art">Culture</option></select></label>
          <label className="text-xs font-semibold">Distance maximale<select value={radius} onChange={event => setRadius(event.target.value)} className="block w-full mt-1 p-3 rounded-xl border border-line bg-canvas text-sm"><option value="all">Toutes les distances</option><option value="1000">1 km</option><option value="5000">5 km</option><option value="10000">10 km</option><option value="20000">20 km</option></select></label>
        </div>
        <p className="text-[11px] text-muted">{activeLocationMode === 'simulation' ? 'Distances simulées depuis la position choisie dans le GPS.' : locationReady ? 'Distances estimées depuis votre GPS réel.' : 'Position GPS réelle en attente : aucun rayon ne peut être appliqué.'} Distances à vol d’oiseau, pas des itinéraires. Ces filtres concernent les établissements ; l’agenda reste affiché.</p>
        {filtering && <button type="button" onClick={() => { setCategory('all'); setRadius('all'); setLocalQuery(''); }} className="text-xs text-blue-400 font-bold py-2 cursor-pointer">Réinitialiser les filtres de sortie</button>}
        <p role="status" className="text-xs text-muted">{filteredPlaces.length} établissement{filteredPlaces.length > 1 ? 's' : ''} correspondant{filteredPlaces.length > 1 ? 's' : ''}</p>
      </section>
      {filtering && <section aria-label="Résultats des sorties" className="space-y-3">
        {filteredPlaces.length === 0 && <p className="p-4 bg-soft rounded-2xl text-sm text-muted">Aucun établissement correspondant dans les données fictives. Élargissez la distance ou changez de catégorie.</p>}
        {filteredPlaces.map(place => <button type="button" key={place.id} onClick={() => onSelectPlace(place.id)} className="w-full rounded-2xl border border-line bg-surface p-3 flex gap-3 text-left items-center cursor-pointer"><SafeImage src={publicationImage(place.coverImage)} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" /><span className="min-w-0 flex-1"><strong className="block text-sm break-words">{place.name}</strong><span className="block text-xs text-muted">{place.categoryLabel} · {place.commune}</span>{place.distance !== undefined && <span className="block text-xs text-blue-400">{(place.distance / 1000).toLocaleString('fr-FR',{maximumFractionDigits:1})} km {activeLocationMode === 'simulation' ? '· simulés' : '· estimés'}</span>}</span><ChevronRight className="w-4 h-4 shrink-0 text-muted" /></button>)}
      </section>}

      {/* Google Maps Grounding Search (Gemini 3.8 Flash) */}
      <div className="bg-surface border border-line rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            Recherche Intelligente Lieux & Événements
          </h3>
        </div>

        <form onSubmit={handleSearchGrounding} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={groundingQuery}
              onChange={(e) => setGroundingQuery(e.target.value)}
              placeholder="Où manger un poisson braisé ce soir à Saint-Jean ?"
              className="w-full bg-canvas border border-line rounded-xl pl-9 pr-3 py-2 text-xs text-ink placeholder-muted focus:outline-none focus:border-rose-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingGrounding}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1 cursor-pointer"
          >
            {isSearchingGrounding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Chercher</span>
            )}
          </button>
        </form>

        {groundingResult && (
          <div className="p-3 rounded-2xl bg-canvas border border-line text-xs space-y-2">
            <p className="text-body leading-relaxed whitespace-pre-line">
              {groundingResult.text}
            </p>

            {groundingResult.groundedPlaces.length > 0 && (
              <div className="pt-2 border-t border-line/80 space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase">Sources Google Maps :</span>
                <div className="flex flex-wrap gap-1.5">
                  {groundingResult.groundedPlaces.map((gp, idx) => (
                    <a
                      key={idx}
                      href={gp.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-line-strong text-blue-400 hover:text-blue-300 text-[11px]"
                    >
                      <span>{gp.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Agenda & Événements à Cocody */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-ink tracking-tight">
              Événements de la Semaine
            </h3>
          </div>
          <span className="text-[10px] text-muted uppercase font-semibold">Abidjan GMT</span>
        </div>

        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-surface border border-line rounded-3xl overflow-hidden shadow-sm flex flex-col sm:flex-row"
            >
              <div className="sm:w-40 aspect-video sm:aspect-auto bg-canvas shrink-0">
                <SafeImage
                  src={evt.coverImage}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-rose-400 font-semibold mb-1">
                    <span>{new Date(evt.utcDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Africa/Abidjan' })} · {evt.timeLabel}</span>
                    <span className="text-muted font-normal">{evt.priceLabel}</span>
                  </div>

                  <h4 className="text-xs font-bold text-ink">{evt.title}</h4>

                  <div className="flex items-center gap-1 text-[11px] text-muted mt-0.5">
                    <MapPin className="w-3 h-3 text-muted" />
                    <span>{evt.locationName} ({evt.commune})</span>
                  </div>

                  <p className="text-[11px] text-body mt-1.5 line-clamp-2">
                    {evt.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center justify-between pt-3 border-t border-line/80 mt-2">
                  <span className="text-[10px] text-muted font-medium">
                    {evt.goingCount} participants · {evt.interestedCount} intéressés
                  </span>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => toggleEventIntent(evt.id, 'interested')}
                      aria-pressed={evt.userIntent === 'interested'}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        evt.userIntent === 'interested'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-canvas text-muted hover:text-ink border border-line'
                      }`}
                    >
                      Ça m'intéresse
                    </button>
                    <button
                      onClick={() => toggleEventIntent(evt.id, 'going')}
                      aria-pressed={evt.userIntent === 'going'}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        evt.userIntent === 'going'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-canvas text-muted hover:text-ink border border-line'
                      }`}
                    >
                      J'y serai
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {!filtering && <>
      {/* Editorial Section 1: Rooftops & Bars Panoramiques */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-ink tracking-tight">
            Rooftops & Cocktails avec Vue Lagune
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rooftops.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place.id)}
              className="bg-surface border border-line rounded-3xl overflow-hidden cursor-pointer hover:border-line-strong transition-all group"
            >
              <div className="aspect-video w-full bg-canvas overflow-hidden relative">
                <SafeImage
                  src={place.coverImage}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono font-bold text-white">
                  {place.priceDescription}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-bold text-ink truncate">{place.name}</h4>
                <p className="text-[11px] text-muted mt-0.5 truncate">
                  {place.neighborhood} ({place.commune})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Section 2: Maquis & Grillades Réputés */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-ink tracking-tight">
            Maquis Réputés & Braisés d'Exception
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {maquis.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place.id)}
              className="bg-surface border border-line rounded-3xl overflow-hidden cursor-pointer hover:border-line-strong transition-all group"
            >
              <div className="aspect-video w-full bg-canvas overflow-hidden relative">
                <SafeImage
                  src={place.coverImage}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono font-bold text-white">
                  {place.priceDescription}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-bold text-ink truncate">{place.name}</h4>
                <p className="text-[11px] text-muted mt-0.5 truncate">
                  {place.neighborhood} ({place.commune})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      </>}
    </div>
  );
};
