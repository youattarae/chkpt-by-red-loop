import crypto from 'node:crypto';
import { BADGE_CATALOG, DEMO_PROGRESS } from '../shared/badgeCatalog';
import { db } from './db';
import { privateDemoEnabled } from './demoConfig';
import type { Badge, BadgeFamily } from '../src/types';

export function evaluateBadges(userId:string){
  const ledger=db.getRawData().points_ledger.filter(entry=>entry.userId===userId);
  const credited=new Set(ledger.filter(entry=>entry.sourceAction==='CHECKIN_VERIFIED').map(entry=>entry.referenceId));
  const visits=db.getCheckins(userId).filter(check=>check.status==='verified'&&credited.has(check.id));
  const distinct=[...new Set(visits.map(check=>check.placeId))].map(id=>db.findPlaceById(id)).filter(place=>!!place);
  const demo=privateDemoEnabled&&userId==='usr_01';
  const counters:Record<BadgeFamily,number>={Explorateur:0,Foodie:0,'Maquis Master':0,'Culture Hunter':0,'Event Hunter':0,Pionnier:0,Photographe:0,'Multi-Explorer':0};
  counters.Explorateur=distinct.filter(place=>place.commune==='Cocody').length;
  counters.Foodie=distinct.filter(place=>['restaurants','cafes_boulangeries'].includes(place.category)).length;
  counters['Maquis Master']=distinct.filter(place=>place.category==='maquis').length;
  counters['Culture Hunter']=distinct.filter(place=>place.category==='culture_art').length;
  counters['Event Hunter']=new Set(ledger.filter(e=>e.sourceAction==='EVENT_ATTENDED').map(e=>e.referenceId)).size;
  counters.Photographe=new Set(ledger.filter(e=>e.sourceAction==='PHOTO_PUBLISHED').map(e=>e.referenceId)).size;
  counters.Pionnier=distinct.filter(place=>{
    const visitors=[...new Set(db.getCheckins().filter(c=>c.placeId===place.id&&c.status==='verified').sort((a,b)=>a.timestamp.localeCompare(b.timestamp)||a.id.localeCompare(b.id)).map(c=>c.userId))];
    return visitors.slice(0,5).includes(userId);
  }).length;
  counters['Multi-Explorer']=new Set([...distinct.map(place=>place.commune),...(demo?['Cocody','Plateau']:[])]).size;
  if(demo) for(const family of Object.keys(counters) as BadgeFamily[]) if(family!=='Multi-Explorer') counters[family]+=DEMO_PROGRESS[family];
  const newlyUnlocked:Badge[]=[];
  const badges=BADGE_CATALOG.map(badge=>{
    const baseline=demo&&DEMO_PROGRESS[badge.family]>=badge.requiredCount;
    const existing=ledger.find(entry=>entry.sourceAction==='BADGE_UNLOCKED'&&entry.referenceId===badge.id);
    const reached=counters[badge.family]>=badge.requiredCount;
    if(reached&&!existing&&!baseline){db.recordLedgerEvent(userId,'BADGE_UNLOCKED',badge.id);newlyUnlocked.push({...badge,currentCount:counters[badge.family],isUnlocked:true});}
    return {...badge,currentCount:counters[badge.family],isUnlocked:!!existing||baseline||reached,unlockedAt:existing?.timestamp};
  });
  return {badges,newlyUnlocked,provisionalRules:true,demonstrationBaseline:demo};
}

export function awardPublishedPhoto(userId:string,checkinId:string,mediaUrl:string){
  const check=db.findCheckinById(checkinId);
  const asset=db.getRawData().media.find(asset=>'/api/media/'+asset.assetId===mediaUrl&&asset.ownerId===userId);
  const published=db.getRawData().posts.some(post=>post.authorId===userId&&post.linkedCheckinId===checkinId&&post.mediaUrl===mediaUrl);
  if(!check||check.userId!==userId||check.status!=='verified'||!asset||!published||db.findPlaceById(check.placeId)?.verificationStatus!=='verified')return null;
  const bytes=Buffer.from(asset.dataBase64.split(',')[1]||'','base64');
  const valid=(asset.mimeType==='image/png'&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))||(asset.mimeType==='image/jpeg'&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)||(asset.mimeType==='image/webp'&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP');
  if(!valid)return null;
  db.recordLedgerEvent(userId,'PHOTO_PUBLISHED',crypto.createHash('sha256').update(bytes).digest('hex'));
  return evaluateBadges(userId);
}

/** Read-only public award labels: no XP, thresholds, counters, proofs or locations. */
export function publicBadgeSummaries(userId:string){
  const ids=new Set(db.getRawData().points_ledger.filter(entry=>entry.userId===userId&&entry.sourceAction==='BADGE_UNLOCKED').map(entry=>entry.referenceId));
  const demo=privateDemoEnabled&&userId==='usr_01';
  return BADGE_CATALOG.filter(badge=>ids.has(badge.id)||demo&&DEMO_PROGRESS[badge.family]>=badge.requiredCount).slice(0,6).map(({id,name,family,tier,iconName})=>({id,name,family,tier,iconName}));
}
