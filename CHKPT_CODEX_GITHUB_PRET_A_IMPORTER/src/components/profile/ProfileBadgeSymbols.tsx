import {useState} from 'react';
import type {Badge} from '../../types';
import {BadgeArt} from '../badges/BadgeArt';
import {Sheet} from '../experience/Sheet';
export function ProfileBadgeSymbols({badges}:{badges:Pick<Badge,'id'|'name'|'family'|'tier'>[]}){
 const [chosen,setChosen]=useState<Pick<Badge,'name'|'family'>|null>(null);
 return <><span role="group" aria-label="Badges publics" className="inline-flex gap-1 shrink-0">{badges.map(b=><button type="button" aria-label={'Badge '+b.name} key={b.id} onClick={()=>setChosen(b)} className="inline-flex p-0.5"><BadgeArt badge={b} compact/></button>)}</span>{chosen&&<Sheet title={chosen.name} onClose={()=>setChosen(null)}><p>{chosen.family} · distinction déjà obtenue.</p></Sheet>}</>;
}
