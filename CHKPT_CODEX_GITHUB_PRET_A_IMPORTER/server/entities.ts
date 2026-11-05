import {db} from './db';import {getEventCatalog} from './events';import {EntityCard,EntityRef} from '../shared/entities';
export function entityCard(ref:EntityRef):EntityCard{
 if(ref.type==='place'){const place=db.findPlaceById(ref.id);if(place)return {...ref,name:place.name,image:place.coverImage,subtitle:place.commune+' · lieu fictif'};}
 if(ref.type==='event'){const event=getEventCatalog().find(e=>e.id===ref.id);if(event)return {...ref,name:event.title,image:event.coverImage,subtitle:event.commune+' · événement fictif'};}
 return {...ref,name:'Fiche indisponible',image:'/illustrations/avatar.svg',subtitle:'Cette fiche n’est plus accessible.',unavailable:true};
}
