import { useStore } from '../../services/store';
import { ABIDJAN_TEST_LOCATIONS } from '../../services/geoService';

export function LocationControls({ onSelect }: { onSelect?: () => void }) {
  const { activeLocationMode, setActiveLocationMode, currentSimulatedSpot, setCurrentSimulatedSpot, setSelectedZone } = useStore();
  return <div className="space-y-3">
    <h3 className="text-[10px] font-bold text-muted uppercase tracking-wider border-b border-line pb-2">Mode de géolocalisation</h3>
    <div className="grid grid-cols-2 gap-2">
      <button type="button" aria-pressed={activeLocationMode === 'simulation'} onClick={() => setActiveLocationMode('simulation')} className={`rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer ${activeLocationMode === 'simulation' ? 'bg-blue-950 text-blue-400' : 'bg-soft text-muted'}`}>Simulateur</button>
      <button type="button" aria-pressed={activeLocationMode === 'browser_gps'} onClick={() => { setActiveLocationMode('browser_gps'); onSelect?.(); }} className={`rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer ${activeLocationMode === 'browser_gps' ? 'bg-blue-950 text-blue-400' : 'bg-soft text-muted'}`}>GPS Réel</button>
    </div>
    {activeLocationMode === 'simulation' && <section aria-label="Positions de démonstration" className="space-y-1">
      <p className="text-[10px] text-muted pb-1">Positions Cocody &amp; Abidjan · simulation :</p>
      {ABIDJAN_TEST_LOCATIONS.map(spot => <button key={spot.id} type="button" aria-pressed={currentSimulatedSpot.id === spot.id} onClick={() => {
        setCurrentSimulatedSpot(spot); setSelectedZone(spot.commune); onSelect?.();
      }} className={`w-full text-left p-2.5 rounded-xl border text-xs cursor-pointer ${currentSimulatedSpot.id === spot.id ? 'bg-rose-950 border-rose-400 text-ink font-semibold' : 'border-transparent text-body hover:bg-soft'}`}>
        <span className="block">{spot.name}</span><span className="block text-[10px] text-muted font-normal mt-1">{spot.commune}</span>
      </button>)}
    </section>}
  </div>;
}
