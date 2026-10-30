import {DEMO_PROFILES} from '../../data/demoProfiles';
import {SafeImage} from '../common/SafeImage';
export function DemoProfileDirectory(){
 return <details className="rounded-2xl border border-line bg-surface p-3"><summary className="cursor-pointer text-xs font-bold">Explorer les 4 profils de démonstration</summary><p className="text-[10px] text-muted mt-2">Portraits générés et biographies fictives. Connectez-vous pour consulter les profils.</p><div className="grid grid-cols-2 gap-2 mt-3">{DEMO_PROFILES.map(profile=><button type="button" key={profile.id} onClick={()=>window.dispatchEvent(new CustomEvent('chkpt:profile',{detail:profile.id}))} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-soft text-center"><SafeImage src={profile.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover"/><strong className="text-xs">{profile.displayName}</strong></button>)}</div></details>;
}
