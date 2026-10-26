import { SafeImage } from '../common/SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Detailed Place Modal Component
 */

import React from 'react';
import { Place } from '../../types';
import { useStore } from '../../services/store';
import { 
  X, 
  MapPin, 
  Clock, 
  Bookmark, 
  Crosshair, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  Share2,
  AlertTriangle
} from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  onCheckinHere: (placeId: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  onCheckinHere,
}) => {
  const { savedPlaceIds, toggleSavePlace } = useStore();

  if (!place) return null;

  const isSaved = savedPlaceIds.includes(place.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cover Image & Close */}
        <div className="relative aspect-video max-h-56 w-full bg-slate-950 overflow-hidden">
          <SafeImage
            src={place.coverImage}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/60"></div>
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/10">
              {place.priceDescription}
            </span>

            <button
              onClick={() => toggleSavePlace(place.id)}
              className={`p-2 rounded-xl backdrop-blur-md border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                  : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
              }`}
              title={isSaved ? 'Retirer des favoris' : 'Enregistrer le lieu'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Place Information */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-4">
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{place.name}</h2>
              {place.verificationStatus === 'verified' && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Référencé · démo</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>{place.categoryLabel}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                {place.neighborhood} ({place.commune})
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {place.description}
          </p>

          {/* Details Pill grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Horaires</span>
                <span className="text-white font-medium text-[11px] truncate block">
                  {place.openingHours || 'Ouvert tous les jours'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Check-ins vérifiés</span>
                <span className="text-white font-bold text-[11px]">
                  {place.totalCheckins} visites
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-slate-400" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                onClose();
                onCheckinHere(place.id);
              }}
              className="flex-1 py-3 bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
              <span>Faire un check-in ici</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
