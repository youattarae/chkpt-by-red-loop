import { BackupControls } from '../demo/BackupControls';
import { useEffect, useState } from 'react';
import { X, Shield } from 'lucide-react';
import { useStore } from '../../services/store';
import { LocationControls } from './LocationControls';
import { ThemeToggle } from './ThemeToggle';

export function SettingsModal({ isOpen, onClose, onOpenBusiness }: { isOpen: boolean; onClose: () => void; onOpenBusiness: () => void }) {
  const [remote, setRemote] = useState(false);
  useEffect(() => { if (isOpen) fetch('/api/demo/access-mode').then(response => response.json()).then(data => setRemote(data.remote === true)).catch(() => setRemote(false)); }, [isOpen]);
  const { currentUser, authSessionToken, setAuthSessionToken, isServerAuthenticated, selectedZone, setSelectedZone, isOperatorView, setIsOperatorView } = useStore();
  useEffect(() => {
    if (!isOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const operator = ['admin', 'superadmin', 'moderator'].includes(currentUser.role);
  return <div role="dialog" aria-modal="true" aria-label="Réglages" className="fixed inset-0 z-50 bg-black/60 p-3 flex items-center justify-center">
    <div className="bg-surface text-ink border border-line rounded-3xl w-full max-w-md max-h-[90dvh] overflow-y-auto p-5 space-y-5">
      <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Réglages</h2><button type="button" onClick={onClose} aria-label="Fermer les réglages" className="p-2 rounded-xl bg-soft cursor-pointer"><X className="w-4 h-4" /></button></div>
      {isServerAuthenticated && localStorage.getItem(`chkpt_legacy_backup_${currentUser.id}`) && <button type="button" className="text-xs text-muted underline cursor-pointer" onClick={()=>{const url=URL.createObjectURL(new Blob([localStorage.getItem(`chkpt_legacy_backup_${currentUser.id}`)!],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='CHKPT-anciennes-donnees-locales.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}>Exporter mes anciennes données de cet appareil</button>}
      <section aria-label="Apparence" className="space-y-3">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Apparence</h3>
        <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold">Mode sombre</span><ThemeToggle /></div>
      </section>
      <section aria-label="Découverte" className="space-y-3 border-t border-line pt-4">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Découverte</h3>
        <label className="flex items-center justify-between gap-3 text-sm">Commune
          <select value={selectedZone} onChange={event => setSelectedZone(event.target.value)} className="bg-soft border border-line rounded-xl px-3 py-2 text-sm">
            {['Cocody', 'Plateau', 'Marcory'].map(zone => <option key={zone}>{zone}</option>)}
          </select>
        </label>
      </section>
      <section aria-label="Position" className="space-y-3 border-t border-line pt-4">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Position</h3>
        <LocationControls />
      </section>
      <button type="button" onClick={() => { onClose(); window.dispatchEvent(new Event('chkpt:welcome')); }} className="w-full rounded-xl bg-soft p-3 text-sm font-semibold cursor-pointer">Revoir les 3 étapes CHKPT</button>
      <button type="button" onClick={() => { onClose(); onOpenBusiness(); }} className="w-full rounded-xl bg-soft p-3 text-sm font-semibold cursor-pointer">Aperçu établissement · fictif</button>
      {remote && <form method="post" action="/demo-access/logout" onSubmit={async event=>{event.preventDefault();const form=event.currentTarget;try{if(authSessionToken)await fetch('/api/auth/logout',{method:'POST',headers:{Authorization:`Bearer ${authSessionToken}`}});}catch{/* Closing locally still protects this device. */}finally{setAuthSessionToken('');form.submit();}}}><button type="submit" className="text-xs text-muted w-full p-2 cursor-pointer">Fermer l’accès privé à distance</button></form>}
      {['admin','superadmin'].includes(currentUser.role) && <BackupControls />}
      {operator && <button type="button" onClick={() => { setIsOperatorView(!isOperatorView); onClose(); }} className="w-full flex items-center justify-center gap-2 bg-soft rounded-xl p-3 text-sm font-semibold cursor-pointer"><Shield className="w-4 h-4" />Console opérateur</button>}
    </div>
  </div>;
}
