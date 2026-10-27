import { useStore } from '../../services/store';
import { ABIDJAN_TEST_LOCATIONS } from '../../services/geoService';

export function LocationControls({ onSelect }: { onSelect?: () => void }) {
  const { activeLocationMode, setActiveLocationMode, currentSimulatedSpot, setCurrentSimulatedSpot, setSelectedZone } = useStore();
  return <div className="space-y-3">
    <p className="text-xs text-muted">La position simulée sert à la démonstration. Utilise le GPS réel pour vérifier ta position.</p>
    <div className="grid grid-cols-2 gap-2">
      <button type="button" aria-pressed={activeLocationMode === 'simulation'} onClick={() => setActiveLocationMode('simulation')} className={`rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer ${activeLocationMode === 'simulation' ? 'bg-blue-950 text-blue-400' : 'bg-soft text-muted'}`}>Simulateur</button>
      <button type="button" aria-pressed={activeLocationMode === 'browser_gps'} onClick={() => { setActiveLocationMode('browser_gps'); onSelect?.(); }} className={`rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer ${activeLocationMode === 'browser_gps' ? 'bg-blue-950 text-blue-400' : 'bg-soft text-muted'}`}>GPS Réel</button>
    </div>
    {activeLocationMode === 'simulation' && <label className="block text-xs text-body">Position de démonstration
      <select aria-label="Position de démonstration" value={currentSimulatedSpot.id} onChange={event => {
        const spot = ABIDJAN_TEST_LOCATIONS.find(item => item.id === event.target.value);
        if (spot) { setCurrentSimulatedSpot(spot); setSelectedZone(spot.commune); onSelect?.(); }
      }} className="mt-2 block w-full bg-soft border border-line rounded-xl px-3 py-2 text-sm">
        {ABIDJAN_TEST_LOCATIONS.map(spot => <option key={spot.id} value={spot.id}>{spot.name}</option>)}
      </select>
    </label>}
  </div>;
}
