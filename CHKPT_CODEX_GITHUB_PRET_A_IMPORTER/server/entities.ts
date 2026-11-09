import {isPresentationStory} from '../shared/storyLifetime';
import {db,UserEntity} from './db';
import {getEventCatalog} from './events';
import {EntityCard,EntityRef} from '../shared/entities';
import {canReadPost,canReadStory} from './contentAccess';
export function entityCard(ref:EntityRef,user?:UserEntity):EntityCard{
 if(ref.type==='place'){const place=db.findPlaceById(ref.id);if(place)return {...ref,name:place.name,image:place.coverImage,subtitle:place.commune+(place.isDemo===false?' · fiche CHKPT':' · lieu fictif')};}
 if(ref.type==='event'){const event=getEventCatalog().find(e=>e.id===ref.id);if(event)return {...ref,name:event.title,image:event.coverImage,subtitle:event.commune+' · événement fictif'};}
 if(ref.type==='post'){const p=db.getRawData().posts.find(p=>p.id===ref.id&&canReadPost(p,user));if(p)return {...ref,name:'Publication de '+p.authorName,image:p.repostOf?'':p.mediaUrl||'',subtitle:p.text.slice(0,140)};}
 if(ref.type==='story'){const s=db.getRawData().stories.find(s=>s.id===ref.id&&canReadStory(s,user));const author=s&&db.findUserById(s.authorId);if(s&&author)return {...ref,name:'Story de '+author.displayName,image:s.mediaType==='image'?s.mediaUrl:'',mediaType:s.mediaType,subtitle:isPresentationStory(s)?'Story fictive permanente · présentation':'Story disponible pendant 24 h'};}
 return {...ref,name:'Contenu indisponible',image:'',subtitle:'Ce contenu n’est plus accessible.',unavailable:true};
}
