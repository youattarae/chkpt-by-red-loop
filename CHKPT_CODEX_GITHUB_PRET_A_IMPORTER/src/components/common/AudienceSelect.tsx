import {CheckInAudience} from '../../types';
import {useStore} from '../../services/store';
export function AudienceSelect({value,onChange,disabled=false}:{value:CheckInAudience;onChange:(value:CheckInAudience)=>void;disabled?:boolean}){
 const {currentUser}=useStore();const privateOnly=currentUser.visibility==='private'||(currentUser.age===undefined||currentUser.age<18);
 return <label className="block text-xs font-semibold space-y-1">Visibilité de la publication<select aria-label="Visibilité de la publication" disabled={disabled||privateOnly} value={privateOnly?'private':value} onChange={event=>onChange(event.target.value as CheckInAudience)} className="block w-full p-3 rounded-xl border border-line bg-canvas"><option value="private">Moi seul</option><option value="followers">Abonnés</option><option value="public">Public</option></select><span className="block text-[11px] font-normal text-muted">{privateOnly?'Votre profil impose une publication privée.':'Ce choix concerne la publication ; votre historique de visites reste personnel.'}</span></label>;
}
