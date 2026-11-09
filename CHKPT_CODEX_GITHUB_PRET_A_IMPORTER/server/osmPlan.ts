import crypto from 'node:crypto';
import type {PlaceEntity} from './db';
import type {PlaceSource} from '../shared/placeSources';
const categories=new Set(['restaurants','cafes_boulangeries','bars_lounges','maquis','culture_art','shopping','nature_bienetre','autre']);
export const normalizePlaceName=(name:string)=>name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,' ').trim().replace(/\s+/g,' ');
export function distance(a:{lat:number;lng:number},b:{lat:number;lng:number}){const d=Math.PI/180,p=(b.lat-a.lat)*d,l=(b.lng-a.lng)*d,q=Math.sin(p/2)**2+Math.cos(a.lat*d)*Math.cos(b.lat*d)*Math.sin(l/2)**2;return Math.round(12742000*Math.atan2(Math.sqrt(q),Math.sqrt(1-q)));}
export function placeCandidates(places:PlaceEntity[],name:string,category:string,coordinates:{lat:number;lng:number}){
 const n=normalizePlaceName(name),words=new Set(n.split(' '));return places.filter(p=>!p.mergedInto&&p.category===category&&distance(p.coordinates,coordinates)<=100).filter(p=>{const m=normalizePlaceName(p.name),w=new Set(m.split(' '));const intersection=[...words].filter(x=>w.has(x)).length;return n===m||intersection/Math.max(words.size,w.size)>=.65;}).map(p=>p.id);
}
export function validPlaceInput(value:any){return value&&typeof value.name==='string'&&value.name.trim().length>=2&&value.name.length<=160&&normalizePlaceName(value.name).length>0&&categories.has(value.category)&&value.coordinates&&Number.isFinite(value.coordinates.lat)&&Number.isFinite(value.coordinates.lng)&&Math.abs(value.coordinates.lat)<=90&&Math.abs(value.coordinates.lng)<=180;}
function categoryOf(tags:Record<string,string>){const a=tags.amenity,t=tags.tourism;
 if(['restaurant','bar','pub'].includes(a)&&typeof tags.name==='string'&&/\bmaquis\b/i.test(tags.name))return {category:'maquis',categoryLabel:'Maquis'};
 if(a==='restaurant'||a==='fast_food')return {category:'restaurants',categoryLabel:'Restaurant'};
 if(a==='cafe'||tags.shop==='bakery')return {category:'cafes_boulangeries',categoryLabel:'Café / boulangerie'};
 if(a==='bar'||a==='pub'||a==='nightclub')return {category:'bars_lounges',categoryLabel:'Bar / lounge'};
 if(['museum','gallery','attraction','artwork'].includes(t)||a==='arts_centre'||tags.historic)return {category:'culture_art',categoryLabel:'Culture / tourisme'};
 if(t==='hotel'||t==='guest_house')return {category:'autre',categoryLabel:'Hôtel',markerKind:'hotel'};
 if(a==='events_venue'||a==='community_centre'||tags.leisure==='dance')return {category:'autre',categoryLabel:'Lieu d’événements',markerKind:'event'};
 return null;
}
export type ImportRow={key:string;decision:'create'|'update'|'manual_match'|'skip';place?:PlaceEntity;source?:PlaceSource;candidateIds?:string[];reason?:string};
export function planOsmImport(input:any,places:PlaceEntity[],sources:PlaceSource[],options:{kind:'osm'|'fixture';matches?:Record<string,string>;bbox?:number[];now?:string}){
 if(!input||!Array.isArray(input.elements)||input.elements.length>5000)throw Error('Extrait Overpass JSON requis, 5 000 objets maximum.');
 const bbox=options.bbox||[-4.04,5.33,-3.90,5.43];if(bbox.length!==4||bbox.some(x=>!Number.isFinite(x))||bbox[0]>=bbox[2]||bbox[1]>=bbox[3])throw Error('Fenêtre géographique invalide.');
 const now=options.now||new Date().toISOString(),seen=new Set<string>(),working=[...places];const rows:ImportRow[]=[];
 for(const e of input.elements){
  if(!e||typeof e!=='object'||Array.isArray(e)){rows.push({key:'invalid',decision:'skip',reason:'Objet source invalide.'});continue;}
  const key=options.kind+'/'+e.type+'/'+e.id;
  if(!['node','way','relation'].includes(e.type)||!Number.isSafeInteger(e.id)||e.id<=0||seen.has(key)){rows.push({key,decision:'skip',reason:'Objet invalide ou dupliqué dans l’extrait.'});continue;}seen.add(key);
  const tags=e.tags||{},coordinates=e.type==='node'?{lat:e.lat,lng:e.lon}:e.center?{lat:e.center.lat,lng:e.center.lon}:null,category=categoryOf(tags),name=typeof tags.name==='string'?tags.name.trim():'';
  if(!category||!validPlaceInput({name,...category,coordinates})||coordinates!.lng<bbox[0]||coordinates!.lat<bbox[1]||coordinates!.lng>bbox[2]||coordinates!.lat>bbox[3]){rows.push({key,decision:'skip',reason:'Nom, catégorie, géométrie ou zone non admissibles.'});continue;}
  const previous=sources.find(s=>s.key===key);const explicit=options.matches?.[key];let current=previous?places.find(p=>p.id===previous.placeId):explicit?places.find(p=>p.id===explicit&&!p.mergedInto):undefined;
  if(explicit&&!current)throw Error('Correspondance manuelle inconnue.');
  if(previous?.version&&Number.isInteger(e.version)&&e.version<previous.version||previous?.sourceTimestamp&&typeof e.timestamp==='string'&&Date.parse(e.timestamp)<Date.parse(previous.sourceTimestamp)){rows.push({key,decision:'skip',reason:'Version source plus ancienne.'});continue;}
  if(!current){const candidateIds=placeCandidates(working,name,category.category,coordinates!);if(candidateIds.length&&!explicit){rows.push({key,decision:'manual_match',candidateIds,reason:'Arbitrage manuel requis ; aucune fusion automatique.'});continue;}}
  const id=current?.id||'plc_'+crypto.createHash('sha256').update(key).digest('hex').slice(0,24);
  const address=[tags['addr:housenumber'],tags['addr:street'],tags['addr:suburb']].filter(v=>typeof v==='string').join(' ').slice(0,300)||'Adresse à confirmer';
  const incoming={name,...category,coordinates:coordinates!,address};
  const place:PlaceEntity=current?{...current}:{id,...incoming,description:options.kind==='fixture'?'Exemple synthétique de test, pas un établissement importé réellement.':'Fiche issue d’OpenStreetMap, informations à confirmer.',commune:'Cocody',neighborhood:'À confirmer',verificationStatus:'unverified',claimStatus:'unclaimed',exploitationStatus:'unknown',priceDescription:'Prix non renseignés',coverImage:'/illustrations/venue-placeholder.svg',tags:[],isCertified:false,isDemo:options.kind==='fixture'};
  for(const [field,value]of Object.entries(incoming))if(!current?.localOverrides?.includes(field))(place as any)[field]=value;
  const source:PlaceSource={key,placeId:id,provider:options.kind==='fixture'?'fixture':'OSM',objectType:e.type,objectId:String(e.id),version:Number.isInteger(e.version)?e.version:undefined,sourceTimestamp:typeof e.timestamp==='string'&&Number.isFinite(Date.parse(e.timestamp))?e.timestamp:undefined,importedAt:now,license:options.kind==='fixture'?'CC0-test-fixture':'ODbL-1.0',attribution:options.kind==='fixture'?'Jeu synthétique CHKPT':'© les contributeurs OpenStreetMap',sourceUrl:options.kind==='fixture'?'fixture:'+key:'https://www.openstreetmap.org/'+e.type+'/'+e.id,lastValues:{name,category:category.category,coordinates:coordinates!,address}};
  rows.push({key,decision:current?'update':'create',place,source});if(!current)working.push(place);
 }
 return {bbox,rows,counts:{created:rows.filter(r=>r.decision==='create').length,updated:rows.filter(r=>r.decision==='update').length,manual:rows.filter(r=>r.decision==='manual_match').length,skipped:rows.filter(r=>r.decision==='skip').length}};
}
