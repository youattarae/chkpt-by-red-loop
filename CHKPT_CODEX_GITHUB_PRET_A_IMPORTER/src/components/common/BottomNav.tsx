/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Contractual 5-Tab Bottom Navigation for CHKPT
 */

import React from 'react';
import { 
  Home, 
  Map, 
  Crosshair, 
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-900 pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Tab 1: Accueil */}
        <button
          onClick={() => onSelectTab('feed')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Accueil</span>
        </button>

        {/* Tab 2: Carte */}
        <button
          onClick={() => onSelectTab('map')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'map' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Carte</span>
        </button>

        {/* Tab 3: Check-in (Central prominent action) */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={onOpenCheckin}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-950 via-rose-900 to-rose-700 text-white shadow-lg shadow-rose-950/60 border-2 border-slate-950 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all group cursor-pointer"
            aria-label="Valider ma présence physique"
          >
            <Crosshair className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            <span className="text-[8px] font-extrabold uppercase tracking-tighter mt-0.5">Check</span>
          </button>
        </div>

        {/* Tab 4: Sortir */}
        <button
          onClick={() => onSelectTab('sortir')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'sortir' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Sortir</span>
        </button>

        {/* Tab 5: Profil */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Profil</span>
        </button>

      </div>
    </nav>
  );
};
