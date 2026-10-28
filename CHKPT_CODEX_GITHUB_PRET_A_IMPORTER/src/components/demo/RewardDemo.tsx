import { useState } from 'react';
import { Gift, Lock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../services/store';
export function RewardDemo() {
  const { currentUser, checkins } = useStore();
  const visit = checkins.find(visit => visit.userId === currentUser.id && visit.status === 'verified' && visit.placeId === 'plc_maquis_etoile');
  const key = `chkpt_abidjan_v1_reward_${currentUser.id}`;
  const [usedFor, setUsedFor] = useState(() => localStorage.getItem(key));
  const used = !!visit && usedFor === visit.id;
  return <section aria-label="Ma récompense de démonstration" className="rounded-2xl border border-line bg-soft p-4 space-y-3">
    <div className="flex gap-3 items-center"><Gift className="w-6 h-6 text-rose-400 shrink-0" /><div><h2 className="text-sm font-bold">La découverte se récompense</h2><p className="text-[11px] text-muted">Exemple fictif · aucun avantage réel</p></div></div>
    <h3 className="text-sm font-bold">Une boisson découverte au maquis</h3>
    <p className="text-xs text-body">Débloquée après un check validé au Maquis L’Étoile d’Abidjan dans ce navigateur. Les XP restent acquis.</p>
    {!visit ? <p className="flex gap-2 items-center text-xs text-muted"><Lock className="w-4 h-4" />À débloquer avec ton premier check au maquis.</p>
      : used ? <p role="status" className="flex gap-2 items-center text-xs text-blue-400"><CheckCircle2 className="w-4 h-4" />Utilisation fictive enregistrée.</p>
      : <button type="button" onClick={() => { localStorage.setItem(key, visit.id); setUsedFor(visit.id); }} className="w-full rounded-xl bg-blue-600 text-white text-xs font-bold py-3 cursor-pointer">Essayer l’utilisation fictive</button>}
    <p className="text-[10px] text-muted">Sans achat, coupon réel ni partenariat. Ne pas présenter à un commerçant pour obtenir une remise.</p>
  </section>;
}
