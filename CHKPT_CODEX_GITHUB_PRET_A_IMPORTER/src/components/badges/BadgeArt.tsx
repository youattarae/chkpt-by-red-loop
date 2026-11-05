import {Camera,Compass,Flame,Map,Palette,CalendarCheck,Sparkles,Utensils,Lock} from 'lucide-react';
import type {Badge} from '../../types';
const icons={Explorateur:Compass,Foodie:Utensils,'Maquis Master':Flame,'Culture Hunter':Palette,'Event Hunter':CalendarCheck,Pionnier:Sparkles,Photographe:Camera,'Multi-Explorer':Map};
const colors={bronze:['#da975b','#8a4929'],silver:['#dce7f7','#68849f'],gold:['#ffe49a','#c88822'],platinum:['#a9fbef','#278eaa'],diamond:['#b9d8ff','#7252c5']};
/** Original vector medals, keyed to the existing family/grade. Locked medals reveal neither grade nor name. */
export function BadgeArt({badge,locked=false}:{badge?:Pick<Badge,'family'|'tier'|'name'>;locked?:boolean}){
 const [light,dark]=!locked&&badge?colors[badge.tier]:['#d7dce3','#727d8b'];const Icon=!locked&&badge?icons[badge.family]:Lock;
 return <div role="img" aria-label={locked?'Badge verrouillé':`Illustration de ${badge?.name}`} className="relative w-full aspect-square max-w-52 mx-auto">
 <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" fill="none">
 <circle cx="100" cy="98" r="87" fill={dark} opacity=".07"/><path d="M64 125 53 184 96 164 106 182 136 126" fill={locked?'#8993a0':'#80002f'} opacity=".9"/>
 <path d="M100 15 163 47 169 111 142 152 100 174 58 152 31 111 37 47Z" fill={dark} stroke={light} strokeWidth="5"/>
 <path d="M100 27 151 53 157 108 132 143 100 160 68 143 43 108 49 53Z" fill={light} opacity=".18" stroke={light} strokeWidth="2"/>
 <path d="m54 130-7-15m12 5-15-5m10-1-9-13m12 2-12-7m90 34 7-15m-12 5 15-5m-10-1 9-13m-12 2 12-7" stroke={light} strokeWidth="4" strokeLinecap="round"/>
 <path d="m100 34 5 9 10 2-8 7 1 10-8-5-8 5 1-10-8-7 10-2Z" fill={light}/><circle cx="100" cy="95" r="34" fill={dark} stroke={light} strokeWidth="2"/>
 </svg><Icon aria-hidden="true" style={{color:light}} strokeWidth={1.5} className="absolute w-[24%] h-[24%] left-[38%] top-[35%]"/>
 </div>;
}
