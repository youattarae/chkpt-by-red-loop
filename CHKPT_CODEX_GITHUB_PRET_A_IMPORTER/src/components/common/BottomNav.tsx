import { BrandSymbol } from './BrandSymbol';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Contractual 5-Tab Bottom Navigation for CHKPT
 */

import React from 'react';
import { 
  Home, 
  Map, 
  Compass, 
  User 
} from 'lucide-react';

export type MainTab = 'feed' | 'map' | 'sortir' | 'profile';

interface BottomNavProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onOpenCheckin: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCheckin
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-lg border-t border-line pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Tab 1: Accueil */}
        <button
          onClick={() => onSelectTab('feed')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-blue-400 font-bold' : 'text-muted hover:text-body'
          }`}
          aria-current={activeTab === 'feed' ? 'page' : undefined}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Accueil</span>
        </button>

        {/* Tab 2: Carte */}
        <button
          onClick={() => onSelectTab('map')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'map' ? 'text-blue-400 font-bold' : 'text-muted hover:text-body'
          }`}
          aria-current={activeTab === 'map' ? 'page' : undefined}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Carte</span>
        </button>

        {/* Tab 3: Check-in (Central prominent action) */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={onOpenCheckin}
            className="checkin-brand-button w-16 h-16 rounded-2xl bg-surface text-ink shadow-lg shadow-shadow-tone/10 border border-line flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            aria-label="Valider ma présence physique"
          >
            <BrandSymbol className="w-10 h-10" />
            <span className="text-[10px] font-bold tracking-tight">Check-in</span>
          </button>
        </div>

        {/* Tab 4: Sortir */}
        <button
          onClick={() => onSelectTab('sortir')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'sortir' ? 'text-blue-400 font-bold' : 'text-muted hover:text-body'
          }`}
          aria-current={activeTab === 'sortir' ? 'page' : undefined}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Sortir</span>
        </button>

        {/* Tab 5: Profil */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-blue-400 font-bold' : 'text-muted hover:text-body'
          }`}
          aria-current={activeTab === 'profile' ? 'page' : undefined}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Profil</span>
        </button>

      </div>
    </nav>
  );
};
