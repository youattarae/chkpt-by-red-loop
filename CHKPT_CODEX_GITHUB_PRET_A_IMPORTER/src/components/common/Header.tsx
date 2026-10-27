import { useState } from 'react';
import { Bell, Crosshair, ChevronDown } from 'lucide-react';
import { useStore } from '../../services/store';
import { BrandSymbol } from './BrandSymbol';
import { LocationControls } from './LocationControls';

interface HeaderProps {
  onOpenNotifications: () => void;
  onGoHome: () => void;
}

export function Header({ onOpenNotifications, onGoHome }: HeaderProps) {
  const { unreadNotificationsCount, activeLocationMode, selectedZone } = useStore();
  const [gpsOpen, setGpsOpen] = useState(false);
  return <header aria-label="En-tête CHKPT" className="sticky top-0 z-40 bg-canvas border-b border-line px-4 py-2.5">
    <div className="max-w-4xl mx-auto flex items-center justify-between">
      <button type="button" onClick={() => { setGpsOpen(false); onGoHome(); }} aria-label="Retour à l’accueil" className="p-1 rounded-xl cursor-pointer"><BrandSymbol className="w-10 h-10" /></button>
      <div className="flex items-center gap-2">
      <div className="relative">
        <button type="button" aria-label="GPS" title="Simulateur de position GPS pour la démo" aria-expanded={gpsOpen} aria-controls="gps-controls" onClick={() => setGpsOpen(!gpsOpen)} className="flex items-center gap-2 px-3 py-2 bg-soft border border-line rounded-xl text-xs font-semibold text-body cursor-pointer">
          <Crosshair className={`w-4 h-4 ${activeLocationMode === 'simulation' ? 'text-amber-400' : 'text-emerald-400'}`} /><span>{selectedZone}</span><ChevronDown className="w-3 h-3 text-muted" />
        </button>
        {gpsOpen && <section id="gps-controls" aria-label="Réglages GPS" className="absolute right-0 top-full mt-2 w-64 max-h-[75dvh] overflow-y-auto p-3 bg-surface border border-line rounded-2xl shadow-xl"><LocationControls onSelect={() => setGpsOpen(false)} /></section>}
      </div>
      <button type="button" onClick={() => { setGpsOpen(false); onOpenNotifications(); }} aria-label="Notifications" className="relative p-2 text-ink rounded-xl hover:bg-soft cursor-pointer">
        <Bell className="w-6 h-6" />
        {unreadNotificationsCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 border border-canvas" />}
      </button>
      </div>
    </div>
  </header>;
}
