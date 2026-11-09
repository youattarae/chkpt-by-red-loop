import {db,PlaceEntity} from './db';
import {planOsmImport} from './osmPlan';
export function importOsm(input:unknown,options:Parameters<typeof planOsmImport>[3],apply=false){
 const plan=planOsmImport(input,db.getRawData().places,db.getRawData().place_sources||[],options);
 if(!apply)return {...plan,applied:false};
 db.transaction(()=>{const data=db.getRawData();for(const row of plan.rows){if(!row.place||!row.source)continue;data.places=data.places.filter(p=>p.id!==row.place!.id).concat(row.place);data.place_sources=(data.place_sources||[]).filter(s=>s.key!==row.key).concat(row.source);}if(plan.counts.created||plan.counts.updated)db.touchPlaces();});
 return {...plan,applied:true};
}
export function mergePlaces(fromId:string,toId:string,apply=false){
 const data=db.getRawData(),from=data.places.find(p=>p.id===fromId&&!p.mergedInto),to=db.findPlaceById(toId);
 if(!from||!to||from.id===to.id)throw Error('Deux fiches distinctes actives sont requises.');
 const impact={fromId:from.id,toId:to.id,checks:data.checkins.filter(c=>c.placeId===from.id).length,posts:data.posts.filter(p=>p.linkedPlaceId===from.id||p.entity?.type==='place'&&p.entity.id===from.id).length,favorites:data.saved_places.filter(s=>s.placeId===from.id).length};
 if(!apply)return {...impact,applied:false};
 db.transaction(()=>{const d=db.getRawData();from.mergedInto=to.id;
  // A manual merge explicitly retains the target identity. Secondary source updates
  // must not move/rename it back to the discarded object on the next import.
  to.localOverrides=[...new Set([...(to.localOverrides||[]),'name','category','coordinates','address','markerKind'])];
  for(const c of d.checkins)if(c.placeId===from.id){c.placeId=to.id;c.placeName=to.name;if(c.status==='pending_validation'){(c as any).manualReviewReason='Lieu fusionné : contrôle manuel requis.';}}
  for(const p of d.checkin_proofs)if(p.placeId===from.id)p.placeId=to.id;
  for(const p of d.posts){if(p.linkedPlaceId===from.id){p.linkedPlaceId=to.id;p.linkedPlaceName=to.name;}if(p.entity?.type==='place'&&p.entity.id===from.id)p.entity.id=to.id;}
  for(const m of d.messages)if(m.entity?.type==='place'&&m.entity.id===from.id)m.entity.id=to.id;
  for(const s of d.saved_places)if(s.placeId===from.id)s.placeId=to.id;d.saved_places=d.saved_places.filter((s,i,a)=>a.findIndex(x=>x.userId===s.userId&&x.placeId===s.placeId)===i);
  for(const r of d.reviews)if(r.placeId===from.id){r.originalPlaceId=r.originalPlaceId||from.id;r.placeId=to.id;}
  const latest=new Map<string,(typeof d.reviews)[number]>();for(const r of d.reviews.filter(r=>r.placeId===to.id&&!r.superseded)){const old=latest.get(r.userId);if(!old||Date.parse(r.updatedAt)>=Date.parse(old.updatedAt)){if(old)old.superseded=true;latest.set(r.userId,r);}else r.superseded=true;}
  for(const a of d.activity)if(a.targetType==='place'&&a.targetId===from.id)a.targetId=to.id;
  for(const s of d.place_sources||[])if(s.placeId===from.id)s.placeId=to.id;
  for(const p of d.place_proposals||[])if(p.placeId===from.id)p.placeId=to.id;
  db.touchPlaces();
 });return {...impact,applied:true};
}
