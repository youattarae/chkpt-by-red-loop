/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Reusable Chip-Based Category Filter Bar Component
 * Supports toggling visibility of places & posts by type:
 * Maquis, Cafés, Culture, Bars, Restaurants
 */

import React from 'react';
import { PlaceCategory } from '../../types';
import { PLACE_CATEGORIES } from '../../data/categories';
import { 
  Flame, 
  Coffee, 
  Palette, 
  Wine, 
  Utensils, 
  Filter, 
  Check, 
  RotateCcw,
  SlidersHorizontal 
} from 'lucide-react';

export interface CategoryFilterBarProps {
  selectedCategories: PlaceCategory[];
  onToggleCategory: (category: PlaceCategory) => void;
  onClearFilters: () => void;
  categoryCounts?: Record<string, number>;
  totalCount?: number;
  filteredCount?: number;
  variant?: 'floating' | 'inline';
  allLabel?: string;
  countUnit?: string;
  className?: string;
  showStatusBanner?: boolean;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategories,
  onToggleCategory,
  onClearFilters,
  categoryCounts = {},
  totalCount,
  filteredCount,
  variant = 'inline',
  allLabel = 'Tous',
  countUnit = 'lieux',
  className = '',
  showStatusBanner = true,
}) => {
  const isFilteringActive = selectedCategories.length > 0;

  const renderIcon = (iconName: string, className: string = 'w-3.5 h-3.5') => {
    switch (iconName) {
      case 'Flame': return <Flame className={className} />;
      case 'Coffee': return <Coffee className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'Wine': return <Wine className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      default: return <Filter className={className} />;
    }
  };

  const containerClasses = variant === 'floating'
    ? 'space-y-1.5'
    : 'space-y-2';

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Scrollable chip container */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        
        {/* 'Tous' Chip */}
        <button
          type="button"
          onClick={onClearFilters}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            !isFilteringActive
              ? 'bg-rose-900 text-white border border-rose-700 shadow-lg shadow-rose-950/40 ring-1 ring-rose-600'
              : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
          }`}
          title="Afficher toutes les catégories"
        >
          {!isFilteringActive && <Check className="w-3.5 h-3.5 text-rose-300 stroke-[3]" />}
          <span>{allLabel}</span>
          {typeof totalCount === 'number' && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              !isFilteringActive ? 'bg-black/40 text-rose-100' : 'bg-slate-800 text-slate-400'
            }`}>
              {totalCount}
            </span>
          )}
        </button>

        {/* Individual Category Chips (Maquis, Cafés, Culture, Bars, Restaurants) */}
        {PLACE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          const count = categoryCounts[cat.id];

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                isSelected
                  ? 'bg-rose-950 text-rose-200 border-rose-600 ring-1 ring-rose-500 shadow-md shadow-rose-950/50 font-bold'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800/90 hover:text-white hover:border-slate-700'
              }`}
              title={cat.description}
            >
              {isSelected ? (
                <Check className="w-3.5 h-3.5 text-rose-400 stroke-[3]" />
              ) : (
                renderIcon(cat.iconName, 'w-3.5 h-3.5 opacity-80')
              )}
              <span>{cat.shortLabel}</span>

              {typeof count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected
                    ? 'bg-rose-900 text-rose-100'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Optional Filter Status Banner */}
      {showStatusBanner && isFilteringActive && (
        <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-900/95 border border-slate-800 text-[11px] text-slate-300 shadow-sm backdrop-blur-md animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>
              Filtre actif : <strong>{selectedCategories.length}</strong> catégorie{selectedCategories.length > 1 ? 's' : ''}
              {typeof filteredCount === 'number' && (
                <> ({filteredCount} {countUnit}{filteredCount > 1 ? (countUnit.endsWith('s') ? '' : 's') : ''})</>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 text-[10px] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Réinitialiser</span>
          </button>
        </div>
      )}
    </div>
  );
};
