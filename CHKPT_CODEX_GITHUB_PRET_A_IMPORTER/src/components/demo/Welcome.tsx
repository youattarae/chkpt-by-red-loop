import { useEffect, useState } from 'react';
import { MapPin, CheckCircle2, Camera, X } from 'lucide-react';
import { BrandSymbol } from '../common/BrandSymbol';
const key = 'chkpt_welcome_done_v1';
const steps = [
  { title: 'Découvre tes prochaines adresses', text: 'Explore les lieux par nom, commune ou catégorie sur la Carte. Les établissements de cette démo sont fictifs.', Icon: MapPin },
  { title: 'Confirme ton passage', text: 'Touche le symbole central, choisis le lieu puis Confirmer le check. Pour la présentation, le GPS peut être simulé.', Icon: CheckCircle2 },
  { title: 'Partage tes découvertes', text: 'Après ton check, tu peux publier si tu le souhaites. Retrouve tes visites et ta récompense fictive dans ton profil.', Icon: Camera },
];
export function Welcome({ visible }: { visible: boolean }) {
  const [done, setDone] = useState(() => localStorage.getItem(key) === 'true');
  const [step, setStep] = useState<number | null>(null);
  const finish = () => { localStorage.setItem(key, 'true'); setDone(true); setStep(null); };
  useEffect(() => {
    const show = () => setStep(0);
    window.addEventListener('chkpt:welcome', show);
    return () => window.removeEventListener('chkpt:welcome', show);
  }, []);
  useEffect(() => {
    if (step === null) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') finish(); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [step]);
  const content = step !== null ? steps[step] : null;
  return <>
    {visible && !done && <section aria-label="Bienvenue sur CHKPT" className="mx-auto max-w-2xl p-3">
      <div className="rounded-2xl bg-soft border border-line p-4 flex items-center gap-3"><BrandSymbol className="w-10 h-10 shrink-0" /><div className="flex-1"><h2 className="text-sm font-bold">Sors. Check. Partage.</h2><button type="button" onClick={() => setStep(0)} className="text-xs font-bold text-blue-400 py-2 cursor-pointer">Découvrir CHKPT en 3 étapes</button></div><button type="button" aria-label="Masquer la bienvenue" onClick={finish} className="p-2 cursor-pointer"><X className="w-4 h-4" /></button></div>
    </section>}
    {content && <div role="dialog" aria-modal="true" aria-label="Découvrir CHKPT" className="fixed inset-0 z-[70] bg-black/60 p-4 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl bg-canvas text-ink p-6 space-y-5 max-h-[90dvh] overflow-y-auto">
        <div className="flex justify-between text-xs text-muted"><span>Étape {step! + 1} sur 3</span><button type="button" autoFocus onClick={finish} className="cursor-pointer">Passer</button></div>
        <div className="bg-blue-950 rounded-3xl p-8 flex justify-center"><content.Icon className="w-16 h-16 text-blue-400" /></div>
        <h2 className="text-xl font-extrabold">{content.title}</h2><p className="text-sm text-body leading-relaxed">{content.text}</p>
        <p className="text-xs text-muted">Prototype privé · données de démonstration</p>
        <div className="flex gap-3">{step! > 0 && <button type="button" onClick={() => setStep(step! - 1)} className="rounded-xl bg-soft p-3 text-sm cursor-pointer">Précédent</button>}<button type="button" onClick={() => step === 2 ? finish() : setStep(step! + 1)} className="flex-1 rounded-xl bg-blue-600 text-white p-3 text-sm font-bold cursor-pointer">{step === 2 ? 'Commencer' : 'Suivant'}</button></div>
      </section>
    </div>}
  </>;
}
