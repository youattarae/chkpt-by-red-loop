import { SafeImage } from '../common/SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Stylized Interactive Map of Abidjan (Lagune Ébrié & Communes)
 * Features local category filter state and Chip-Based CategoryFilterBar (Maquis, Cafés, Culture, Bars)
 * Respects: ZÉRO publicité sur la Carte (Section 11)
 */

import React, { useState, useMemo } from 'react';
import { useStore } from '../../services/store';
import { Place, PlaceCategory } from '../../types';
import { PLACE_CATEGORIES } from '../../data/categories';
import { CategoryFilterBar } from '../common/CategoryFilterBar';
import { 
  MapPin, 
  CheckCircle2, 
  Crosshair, 
  Filter 
} from 'lucide-react';

const DynamicMap = React.lazy(()=>import('./DynamicMap').then(module=>({default:module.DynamicMap})));

interface MapViewProps {
  onSelectPlace: (placeId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ onSelectPlace }) => {
  const { places, userCurrentCoordinates, locationReady, activeLocationMode } = useStore();
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [interactive, setInteractive] = useState(true);

  // Local state to store selected categories (Chip-based multi-toggle)
  const [query, setQuery] = useState('');
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(places[0]?.id || null);

  // Toggle category visibility
  const handleToggleCategory = (catId: PlaceCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        return prev.filter((id) => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  // Reset to display all places
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setQuery('');
  };

  // Filtered places according to active category chips
  const filteredPlaces = useMemo(() => {
    const words = normalize(query).trim().split(/\s+/).filter(Boolean);
    return places.filter(place => (selectedCategories.length === 0 || selectedCategories.includes(place.category as PlaceCategory)) && words.every(word => normalize(`${place.name} ${place.commune} ${place.neighborhood} ${place.categoryLabel}`).includes(word)));
  }, [places, selectedCategories, query]);

  // Selected place for bottom card preview
  const activePlace = useMemo(() => {
    if (filteredPlaces.length === 0) return null;
    const found = filteredPlaces.find((p) => p.id === selectedPlaceId);
    return found || filteredPlaces[0];
  }, [filteredPlaces, selectedPlaceId]);

  // Place counts per category for the chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of PLACE_CATEGORIES) {
      counts[cat.id] = places.filter((p) => p.category === cat.id).length;
    }
    return counts;
  }, [places]);

  return (
    <div className="relative w-full h-[calc(100dvh-145px)] min-h-[720px] bg-canvas overflow-hidden flex flex-col">
      
      <span className="absolute bottom-28 left-4 z-10 text-[10px] text-muted bg-canvas/80 rounded-lg px-2 py-1">{interactive ? 'Repères de lieux fictifs' : 'Carte illustrée · positions de démonstration'}</span>
      <div className="p-3 bg-canvas relative z-20">
        <label className="text-xs font-bold block">Rechercher un établissement<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Nom, commune ou catégorie…" className="block w-full mt-1 p-3 rounded-xl border border-line bg-surface text-sm text-ink" /></label>
        <p role="status" className="text-[10px] text-muted mt-1">{filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''} trouvé{filteredPlaces.length > 1 ? 's' : ''} · données fictives</p>
      </div>
      <div className="px-3 pb-2 flex gap-2"><button type="button" aria-pressed={interactive} onClick={()=>setInteractive(true)} className="text-[10px] rounded-lg px-2 py-1 bg-soft cursor-pointer">Carte interactive</button><button type="button" aria-pressed={!interactive} onClick={()=>setInteractive(false)} className="text-[10px] rounded-lg px-2 py-1 bg-soft cursor-pointer">Carte illustrée</button></div>
      {mapUnavailable && !interactive && <p role="status" className="px-3 text-[10px] text-muted">Fond de carte indisponible : carte illustrée de secours active.</p>}
      {/* Floating Chip-Based Category Filter Bar */}
      <div className="relative px-3 z-20">
        <CategoryFilterBar
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          onClearFilters={handleResetFilters}
          categoryCounts={categoryCounts}
          totalCount={places.length}
          filteredCount={filteredPlaces.length}
          allLabel="Tous les spots"
          countUnit="lieux"
          variant="floating"
          showStatusBanner={true}
        />
      </div>

      {interactive ? <React.Suspense fallback={<p className="p-4 text-xs text-muted">Chargement de la carte interactive…</p>}><DynamicMap places={filteredPlaces} position={userCurrentCoordinates} ready={locationReady} simulated={activeLocationMode==='simulation'} selectedId={activePlace?.id || null} onSelect={setSelectedPlaceId} onFallback={()=>{setInteractive(false);setMapUnavailable(true);}} /></React.Suspense> : <>
      {/* Stylized Vector Map of Abidjan Canvas */}
      <div className="relative flex-1 w-full bg-canvas flex items-center justify-center p-4 pt-16">
        
        {/* SVG Drawing of the Ébrié Lagoon and Communes */}
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-w-3xl opacity-90 select-none"
        >
          <defs>
            <linearGradient id="lagoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--map-water)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--map-water-end)" stopOpacity="0.9" />
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--map-grid)" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="800" height="600" fill="url(#grid)" />

          {/* Ébrié Lagoon waters */}
          <path
            d="M 50 350 Q 200 300 380 340 T 600 330 T 780 390 L 780 480 Q 550 430 350 450 T 50 430 Z"
            fill="url(#lagoonGrad)"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <path
            d="M 280 200 Q 320 280 300 340 T 260 480 L 220 480 Q 240 330 230 200 Z"
            fill="url(#lagoonGrad)"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />

          {/* Territory Labels */}
          <text x="460" y="240" fill="var(--map-label)" fontSize="18" fontWeight="bold" letterSpacing="3">
            COCODY
          </text>
          <text x="470" y="260" fill="var(--map-label)" fontSize="11" letterSpacing="1">
            Danga · Saint-Jean · Vallons · Riviera
          </text>

          <text x="140" y="320" fill="var(--map-label)" fontSize="18" fontWeight="bold" letterSpacing="3">
            LE PLATEAU
          </text>
          <text x="145" y="338" fill="var(--map-label)" fontSize="11">
            Centre des Affaires
          </text>

          <text x="360" y="520" fill="var(--map-label)" fontSize="18" fontWeight="bold" letterSpacing="3">
            MARCORY
          </text>
          <text x="380" y="538" fill="var(--map-label)" fontSize="11">
            Zone 4C · Biétry
          </text>

          <text x="390" y="415" fill="var(--tone-blue-400)" fontSize="12" fontStyle="italic" opacity="0.6">
            ~ Lagune Ébrié ~
          </text>

          {/* Bridges */}
          <line x1="260" y1="330" x2="280" y2="440" stroke="var(--tone-rose-400)" strokeWidth="2.5" strokeDasharray="3,3" opacity="0.7" />
          <text x="275" y="390" fill="var(--tone-rose-400)" fontSize="9" fontWeight="bold">Pont H.K.B.</text>

          <line x1="190" y1="340" x2="210" y2="440" stroke="var(--tone-rose-400)" strokeWidth="2.5" strokeDasharray="3,3" opacity="0.7" />
          <text x="140" y="380" fill="var(--tone-rose-400)" fontSize="9" fontWeight="bold">Pont De Gaulle</text>
        </svg>

        {/* Empty state overlay when all filtered out */}
        {filteredPlaces.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-canvas/80 backdrop-blur-sm p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-line text-muted flex items-center justify-center mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-ink">Aucun lieu ne correspond à votre recherche</h3>
            <p className="text-xs text-muted max-w-xs mt-1">
              Modifiez le nom ou les catégories pour retrouver les lieux fictifs.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Afficher tous les lieux
            </button>
          </div>
        )}

        {/* Place Markers Overlay for filtered places */}
        <div className="absolute inset-0 max-w-3xl mx-auto pointer-events-none pt-16">
          {filteredPlaces.map((place) => {
            const topPct = Math.min(85, Math.max(15, ((5.375 - place.coordinates.lat) / (5.375 - 5.285)) * 100));
            const leftPct = Math.min(88, Math.max(12, ((place.coordinates.lng - -4.03) / (-3.95 - -4.03)) * 100));

            const isSelected = activePlace?.id === place.id;
            const isVerified = place.verificationStatus === 'verified';

            return (
              <div
                key={place.id}
                style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <button
                  onClick={() => setSelectedPlaceId(place.id)}
                  aria-label={`Choisir ${place.name}`}
                  className={`relative flex flex-col items-center group cursor-pointer transition-transform ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors ${
                      isSelected
                        ? 'bg-rose-600 border-white text-white ring-4 ring-rose-500/40'
                        : isVerified
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-surface border-line-strong text-muted'
                    }`}
                  >
                    <MapPin className="w-4 h-4 fill-current" />
                  </div>

                  <span className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-md backdrop-blur-md border ${
                    isSelected
                      ? 'bg-rose-950 text-ink border-rose-500'
                      : 'bg-surface/90 text-body border-line'
                  }`}>
                    {place.name.split(' ')[0]}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

      </div>

      </>}
      {/* Selected Place Bottom Preview Card */}
      {activePlace && (
        <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-lg mx-auto z-30">
          <div className="bg-surface/95 border border-line rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200">
            <SafeImage
              src={activePlace.coverImage}
              alt={activePlace.name}
              className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-line"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-ink truncate">{activePlace.name}</h4>
                {activePlace.verificationStatus === 'verified' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </div>

              <span className="text-[11px] text-muted block mt-0.5 truncate">
                {activePlace.categoryLabel} · {activePlace.neighborhood} ({activePlace.commune})
              </span>

              <span className="text-[10px] text-rose-400 font-mono font-bold mt-1 block">
                {activePlace.priceDescription}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={() => onSelectPlace(activePlace.id)}
                className="px-3 py-1.5 bg-soft hover:bg-raised text-ink font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Détails
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
