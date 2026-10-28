import type { Badge, BadgeFamily } from '../src/types';
export const DEMO_PROGRESS: Record<BadgeFamily,number> = { Explorateur:8, Foodie:5, 'Maquis Master':4, 'Culture Hunter':2, 'Event Hunter':2, Pionnier:1, Photographe:3, 'Multi-Explorer':2 };
const families: {family:BadgeFamily;slug:string;name:string;icon:string;thresholds:number[];rule:string}[] = [
  {family:'Explorateur',slug:'explorateur',name:'Flâneur de Cocody',icon:'Compass',thresholds:[10,25,50,100,200],rule:'lieux distincts visités à Cocody'},
  {family:'Foodie',slug:'foodie',name:'Gourmet de Babi',icon:'Utensils',thresholds:[5,10,25,50,100],rule:'restaurants ou cafés distincts visités'},
  {family:'Maquis Master',slug:'maquis',name:'Initié du Braisé',icon:'Flame',thresholds:[5,10,25,50,100],rule:'maquis distincts visités'},
  {family:'Culture Hunter',slug:'culture',name:'Amateur d’Art Babi',icon:'Palette',thresholds:[3,10,25,50,100],rule:'lieux culturels distincts visités'},
  {family:'Event Hunter',slug:'event',name:'Noctambule Festif',icon:'CalendarCheck',thresholds:[3,5,10,25,50],rule:'événements distincts avec présence validée pendant leurs horaires'},
  {family:'Pionnier',slug:'pionnier',name:'Éclaireur Urbain',icon:'Sparkles',thresholds:[1,3,5,10,20],rule:'lieux où vous figurez parmi les cinq premiers visiteurs distincts'},
  {family:'Photographe',slug:'photographe',name:'Regard Visuel',icon:'Camera',thresholds:[5,10,25,50,100],rule:'photos importées distinctes associées à un check validé'},
  {family:'Multi-Explorer',slug:'multi',name:'Traverseur de Ponts',icon:'Map',thresholds:[3,4,5,7,10],rule:'communes distinctes visitées'},
];
const tiers=['bronze','silver','gold','platinum','diamond'] as const;
const labels=['Bronze','Argent','Or','Platine','Diamant'];
export const BADGE_CATALOG: Badge[] = families.flatMap(f=>tiers.map((tier,index)=>({id:`bdg_${f.slug}_${tier}`,name:index===0?f.name:`${f.family} · ${labels[index]}`,family:f.family,tier,description:`${f.thresholds[index]} ${f.rule}. Barème provisoire.`,iconName:f.icon,requiredCount:f.thresholds[index],currentCount:0,isUnlocked:false,xpReward:0})));
export function demoBadges():Badge[]{return BADGE_CATALOG.map(b=>({...b,currentCount:DEMO_PROGRESS[b.family],isUnlocked:DEMO_PROGRESS[b.family]>=b.requiredCount}));}
