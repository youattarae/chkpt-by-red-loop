import {BADGE_CATALOG} from './badgeCatalog';
import type {Badge} from '../src/types';
export function displayBadges<T extends Pick<Badge,'id'|'tier'>>(earned:T[],selected?:string[]):T[]{
 const available=new Map(earned.map(b=>[b.id,b]));
 if(selected!==undefined)return selected.filter((id,i,ids)=>ids.indexOf(id)===i&&available.has(id)).slice(0,3).map(id=>available.get(id)!);
 const rank=['bronze','silver','gold','platinum','diamond'];
 // Grade first; equal grades keep the already existing catalogue order, no new family weighting.
 return [...earned].sort((a,b)=>rank.indexOf(b.tier)-rank.indexOf(a.tier)||BADGE_CATALOG.findIndex(x=>x.id===a.id)-BADGE_CATALOG.findIndex(x=>x.id===b.id)).slice(0,3);
}
