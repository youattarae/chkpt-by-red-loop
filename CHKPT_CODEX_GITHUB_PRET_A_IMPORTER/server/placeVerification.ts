import {db,CheckInEntity} from './db';
import {calculateDistanceMeters,CHECKIN_RADIUS_METERS} from './checkinEngine';
import {privateDemoEnabled} from './demoConfig';
import {evaluateBadges,awardPublishedPhoto} from './badgeEngine';
function reviewReason(check:CheckInEntity,manual=false):string|undefined{
 const place=db.findPlaceById(check.placeId),proof=db.getRawData().checkin_proofs.find(p=>p.checkinId===check.id&&p.userId===check.userId);
 if(!place||place.verificationStatus!=='verified'||place.verificationDecision==='rejected')return 'Lieu non vérifié ou rejeté.';
 if(!check.eligibility||check.eligibility.version!==1||!check.eligibility.placeCoordinates||!Number.isFinite(check.eligibility.placeCoordinates.lat)||!Number.isFinite(check.eligibility.placeCoordinates.lng)||!proof||!Number.isFinite(Date.parse(check.timestamp))||Date.parse(check.timestamp)>Date.now()||proof.timestamp!==check.timestamp||db.findPlaceById(proof.placeId)?.id!==place.id||proof.isSimulated!==check.isSimulated)return 'Preuve historique insuffisante : contrôle manuel requis.';
 if(!Number.isFinite(proof.calculatedDistanceMeters)||proof.calculatedDistanceMeters<0||!Number.isFinite(proof.reportedLat)||!Number.isFinite(proof.reportedLng)||Math.abs(proof.reportedLat)>90||Math.abs(proof.reportedLng)>180||!Number.isFinite(proof.accuracyMeters)||proof.accuracyMeters<0||proof.isSimulated&&!privateDemoEnabled||proof.calculatedDistanceMeters>CHECKIN_RADIUS_METERS||calculateDistanceMeters({lat:proof.reportedLat,lng:proof.reportedLng},place.coordinates)>CHECKIN_RADIUS_METERS)return 'Preuve de présence non admissible.';
 if(proof.accuracyMeters>CHECKIN_RADIUS_METERS)return 'Précision GPS insuffisante, aucun crédit automatique.';
 if(!manual&&(check.manualReviewReason||check.eligibility.placeCoordinates.lat!==place.coordinates.lat||check.eligibility.placeCoordinates.lng!==place.coordinates.lng))return check.manualReviewReason||'Coordonnées du lieu modifiées : contrôle manuel requis.';
 const duplicate=db.getCheckins(check.userId).some(c=>c.id!==check.id&&c.placeId===place.id&&c.status==='verified'&&c.timestamp.slice(0,10)===check.timestamp.slice(0,10));
 if(duplicate)return 'Une visite est déjà créditée ce jour pour ce lieu.';
 if(db.getRawData().points_ledger.some(p=>p.sourceAction==='CHECKIN_VERIFIED'&&p.referenceId===check.id))return 'Crédit déjà enregistré : état à contrôler.';
 return undefined;
}
export function creditPending(check:CheckInEntity,manual=false){
 if(check.status!=='pending_validation')return {id:check.id,credited:0,status:check.status};
 const reason=reviewReason(check,manual);if(reason){check.manualReviewReason=reason;return {id:check.id,credited:0,status:'manual_review',reason};}
 const first=!db.getCheckins(check.userId).some(c=>c.placeId===check.placeId&&c.status==='verified');
 const amount=db.creditCheckin(check.id,first?75:50);delete check.manualReviewReason;
 const event=check.eligibility?.event;if(event&&Date.parse(event.startsAt)<=Date.parse(check.timestamp)&&Date.parse(event.endsAt)>=Date.parse(check.timestamp)&&db.findPlaceById(event.placeId)?.id===check.placeId)db.recordLedgerEvent(check.userId,'EVENT_ATTENDED',event.id);
 for(const post of db.getRawData().posts.filter(p=>p.linkedCheckinId===check.id&&p.mediaUrl))awardPublishedPhoto(check.userId,check.id,post.mediaUrl!);
 evaluateBadges(check.userId);
 if(amount){const id='retro_'+check.id;const data=db.getRawData();if(!data.activity.some(a=>a.id===id))data.activity.push({id,recipientId:check.userId,title:'XP crédités après vérification du lieu',body:`Votre check à ${check.placeName} est validé : +${amount} XP. Aucun nouveau déplacement nécessaire.`,targetType:'place',targetId:check.placeId,createdAt:new Date().toISOString()});}
 return {id:check.id,credited:amount,status:check.status};
}
export function verifyPlace(id:string,status:'verified'|'unverified'|'rejected'){
 const place=db.findPlaceById(id);if(!place)throw Error('Lieu introuvable.');
 return db.transaction(()=>{place.verificationStatus=status==='verified'?'verified':'unverified';place.isCertified=status==='verified';place.verificationDecision=status==='rejected'?'rejected':undefined;
  const pending=db.getCheckins().filter(c=>c.placeId===place.id&&c.status==='pending_validation').sort((a,b)=>a.timestamp.localeCompare(b.timestamp)||a.id.localeCompare(b.id));
  let results:any[]=[];if(status==='verified')results=pending.map(c=>creditPending(c));else if(status==='rejected'){for(const c of pending){c.status='rejected';c.rejectionReason='place_rejected';}results=pending.map(c=>({id:c.id,credited:0,status:c.status}));}
  db.touchPlaces();return {place,results,creditedXp:results.reduce((n,r)=>n+r.credited,0)};
 });
}
export function reviewPending(id:string,approve:boolean,reason:string){
 const check=db.findCheckinById(id);if(!check)throw Error('Check indisponible.');return db.transaction(()=>{if(check.status!=='pending_validation')return {id:check.id,credited:0,status:check.status};if(!approve){check.status='rejected';check.rejectionReason='manual_rejection';check.manualReviewReason=reason;return {id,credited:0,status:check.status};}return creditPending(check,true);});
}
