import {ProfileBadgePicker} from './ProfileBadgePicker';
import {BADGE_CATALOG} from '../../../shared/badgeCatalog';
import type {Badge,BadgeFamily} from '../../types';
import {useStore} from '../../services/store';
import {useNavigation} from '../../navigation/Navigation';
import {PageLayout} from '../navigation/PageLayout';
import {BadgeArt} from './BadgeArt';
export const BADGE_FAMILIES:{id:string;name:BadgeFamily}[]=[{id:'explorateur',name:'Explorateur'},{id:'foodie',name:'Foodie'},{id:'maquis',name:'Maquis Master'},{id:'culture',name:'Culture Hunter'},{id:'event',name:'Event Hunter'},{id:'pionnier',name:'Pionnier'},{id:'photographe',name:'Photographe'},{id:'multi',name:'Multi-Explorer'}];
// Order and denominator come from the existing catalogue; only server-confirmed awards become colored.
function collection(badges:Badge[]){return BADGE_CATALOG.map(item=>badges.find(b=>b.id===item.id)||{...item,isUnlocked:false,currentCount:0});}
function currentBadge(badges:Badge[]){return badges.filter(b=>b.isUnlocked).at(-1);}
const notice='Collection calculée par le serveur · barème et noms provisoires. Les personnages de présentation peuvent avoir des acquis fictifs préparés.';
export function BadgesView({onBack,embedded=false}:{onBack:()=>void;embedded?:boolean}){
 const {badges}=useStore(),nav=useNavigation();const items=collection(badges);
 const content=<><p className="text-sm text-muted">Votre collection. Huit univers à découvrir.</p><div aria-label="Collection des huit familles" className="grid grid-cols-2 gap-3 sm:gap-5">{BADGE_FAMILIES.map(family=>{const badge=currentBadge(items.filter(b=>b.family===family.name));return <button key={family.id} type="button" aria-label={family.name} onClick={()=>nav.push({page:'badge-family',id:family.id,tab:nav.current.route.tab})} className="p-3 rounded-3xl bg-gradient-to-br from-surface to-soft border border-line shadow-sm hover:shadow-lg focus-visible:outline-2 focus-visible:outline-blue-500"><BadgeArt badge={badge} locked={!badge}/><span className="block text-sm sm:text-base font-extrabold text-ink pb-2">{family.name}</span></button>;})}</div><ProfileBadgePicker/><p className="text-xs text-muted leading-relaxed">{notice}</p></>;
 return embedded?content:<PageLayout title="Badges et progression" onBack={onBack}>{content}</PageLayout>;
}
export function BadgeFamilyPage({id,onBack,onAccount}:{id:string;onBack:()=>void;onAccount:()=>void}){
 const {badges,isServerAuthenticated}=useStore();const family=BADGE_FAMILIES.find(f=>f.id===id);
 if(!family)return <PageLayout title="Famille indisponible" onBack={onBack}><p>Cette famille n’est pas disponible.</p></PageLayout>;
 const items=collection(badges).filter(b=>b.family===family.name),current=currentBadge(items),unlocked=items.filter(b=>b.isUnlocked);
 return <PageLayout title={family.name} onBack={onBack}>{!isServerAuthenticated?<><p>Connectez-vous pour consulter votre collection personnelle.</p><button type="button" onClick={onAccount} className="p-3 bg-blue-600 text-white rounded-xl">Se connecter</button></>:<>
 <div className="max-w-44 mx-auto"><BadgeArt badge={current} locked={!current}/></div><p className="text-center font-bold">Badges débloqués : {unlocked.length}/{items.length}</p>
 <ol aria-label="Badges de la famille" className="grid grid-cols-2 sm:grid-cols-3 gap-3">{items.map((badge,index)=><li key={badge.id} className="rounded-2xl border border-line bg-surface p-3 text-center"><BadgeArt badge={badge.isUnlocked?badge:undefined} locked={!badge.isUnlocked}/>{badge.isUnlocked?<p className="text-sm font-bold text-ink">{badge.name}</p>:<span className="sr-only">Emplacement {index+1} · Badge verrouillé</span>}</li>)}</ol>
 <section aria-label="Badge actuel" className="rounded-3xl border border-line bg-soft p-5 space-y-3"><h2 className="font-extrabold text-lg">Badge actuel</h2>{current?<><p className="font-bold">{current.name}</p><p className="text-sm text-body">{current.currentCount>=current.requiredCount?`Vous avez obtenu ce badge grâce à au moins ${current.description.replace(/\. Barème provisoire\.$/,'')}.`:'Ce badge a déjà été enregistré dans votre collection.'}</p></>:<p className="text-sm text-body">Votre collection commence ici. Vos prochaines découvertes ont encore des surprises pour vous.</p>}</section><p className="text-xs text-muted leading-relaxed">{notice}</p>
 </>}</PageLayout>;
}
