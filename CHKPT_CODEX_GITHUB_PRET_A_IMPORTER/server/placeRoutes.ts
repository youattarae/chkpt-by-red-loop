import {verifyPlace,reviewPending} from './placeVerification';
import type {Express} from 'express';
import crypto from 'node:crypto';
import {db,PlaceEntity} from './db';
import {requireAuth,requireOperator} from './auth';
import {requirePrivateDemo} from './demoConfig';
import {validPlaceInput,placeCandidates} from './osmPlan';
import {importOsm,mergePlaces} from './placeRepository';
export function installPlaceRoutes(app:Express){
 app.get('/api/places/:id/provenance',(req,res)=>{const place=db.findPlaceById(req.params.id as string);if(!place){res.status(404).json({message:'Lieu indisponible.'});return;}res.json({placeId:place.id,sources:(db.getRawData().place_sources||[]).filter(s=>s.placeId===place.id).map(s=>({provider:s.provider,objectType:s.objectType,objectId:s.objectId,version:s.version,sourceTimestamp:s.sourceTimestamp,license:s.license,attribution:s.attribution,sourceUrl:s.sourceUrl,importedAt:s.importedAt}))});});
 app.post('/api/places/proposals',requireAuth,(req,res)=>{
  const {name,category,coordinates,address='',clientRequestId}=req.body;const user=req.user!;
  if(!validPlaceInput({name,category,coordinates})||typeof address!=='string'||address.length>300||typeof clientRequestId!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(clientRequestId)){res.status(400).json({message:'Nom, catégorie, position et identifiant de proposition valides requis.'});return;}
  const id='proposal_'+crypto.createHash('sha256').update(user.id+':'+clientRequestId).digest('hex').slice(0,24),all=db.getRawData().place_proposals||[];const old=all.find(p=>p.id===id);if(old){res.json({proposal:old});return;}
  if(all.filter(p=>p.userId===user.id&&p.createdAt.slice(0,10)===new Date().toISOString().slice(0,10)).length>=20){res.status(429).json({message:'Limite de propositions atteinte pour aujourd’hui.'});return;}
  const proposal={id,userId:user.id,name:name.trim(),category,coordinates,createdAt:new Date().toISOString(),status:'pending' as const,candidates:placeCandidates(db.getPlaces(),name,category,coordinates),address};
  db.updateSharedData({place_proposals:[...all,proposal]});res.status(201).json({proposal});
 });
 app.get('/api/account/place-proposals',requireAuth,(req,res)=>res.json({proposals:(db.getRawData().place_proposals||[]).filter(p=>p.userId===req.user!.id)}));
 app.use('/api/operator/places',requirePrivateDemo,requireOperator);
 app.get('/api/operator/places',(_req,res)=>res.json({places:db.getPlaces(),proposals:db.getRawData().place_proposals||[],sources:db.getRawData().place_sources||[]}));
 app.post('/api/operator/places/:id/verification',(req,res)=>{if(!['verified','unverified','rejected'].includes(req.body.status)){res.status(400).json({message:'Statut invalide.'});return;}try{res.json(verifyPlace(req.params.id as string,req.body.status));}catch(e){res.status(400).json({message:e instanceof Error?e.message:'Vérification refusée.'});}});
 app.get('/api/operator/places/checks/pending',(_req,res)=>res.json({checks:db.getCheckins().filter(c=>c.status==='pending_validation').map(c=>({id:c.id,placeId:c.placeId,placeName:c.placeName,status:c.status,createdAt:c.createdAt,manualReviewReason:c.manualReviewReason}))}));
 app.post('/api/operator/places/checks/:id/review',(req,res)=>{if(typeof req.body.approve!=='boolean'||typeof req.body.reason!=='string'||req.body.reason.trim().length<5){res.status(400).json({message:'Décision motivée requise.'});return;}try{res.json(reviewPending(req.params.id as string,req.body.approve,req.body.reason));}catch(e){res.status(400).json({message:e instanceof Error?e.message:'Contrôle refusé.'});}});
 app.post('/api/operator/places/import-osm',(req,res)=>{
  if(!['osm','fixture'].includes(req.body.sourceKind)||typeof req.body.apply!=='boolean'){res.status(400).json({message:'Source et mode explicites requis.'});return;}
  try{res.json(importOsm(req.body.extract,{kind:req.body.sourceKind,matches:req.body.matches,bbox:req.body.bbox},req.body.apply));}catch(e){res.status(400).json({message:e instanceof Error?e.message:'Import refusé.'});}
 });
 app.post('/api/operator/places/merge',(req,res)=>{if(typeof req.body.fromId!=='string'||typeof req.body.toId!=='string'||typeof req.body.apply!=='boolean'||req.body.apply&&req.body.confirmation!=='MERGE'){res.status(400).json({message:'Fusion explicite avec aperçu et confirmation requise.'});return;}try{res.json(mergePlaces(req.body.fromId,req.body.toId,req.body.apply));}catch(e){res.status(400).json({message:e instanceof Error?e.message:'Fusion refusée.'});}});
 app.post('/api/operator/places/:id/corrections',(req,res)=>{
  const place=db.findPlaceById(req.params.id as string),fields=req.body.fields;if(!place||!fields||typeof fields!=='object'||Array.isArray(fields)||Object.keys(fields).some(k=>!['name','category','address','coordinates','description'].includes(k))||fields.address!==undefined&&(typeof fields.address!=='string'||fields.address.length>300)||fields.description!==undefined&&(typeof fields.description!=='string'||fields.description.length>3000)||!validPlaceInput({...place,...fields})){res.status(400).json({message:'Correction invalide.'});return;}
  db.transaction(()=>{Object.assign(place,fields);place.localOverrides=[...new Set([...(place.localOverrides||[]),...Object.keys(fields)])];if(fields.coordinates){for(const c of db.getCheckins())if(c.placeId===place.id&&c.status==='pending_validation')c.manualReviewReason='Coordonnées du lieu corrigées : contrôle manuel requis.';}db.touchPlaces();});res.json({place});
 });
 app.post('/api/operator/places/proposals/:id/review',(req,res)=>{
  const proposal=db.getRawData().place_proposals?.find(p=>p.id===req.params.id);const {decision,existingPlaceId,distinctReason}=req.body;
  if(!proposal||!['approve','reject','link'].includes(decision)){res.status(400).json({message:'Décision invalide.'});return;}
  if(proposal.status!=='pending'){res.json({proposal});return;}
  const existing=existingPlaceId?db.findPlaceById(existingPlaceId):undefined;if(decision==='link'&&!existing){res.status(400).json({message:'Choisissez une fiche existante.'});return;}
  if(decision==='approve'&&proposal.candidates.length&&(typeof distinctReason!=='string'||distinctReason.trim().length<5)){res.status(409).json({message:'Des correspondances existent : choisir la fiche ou justifier un établissement distinct.'});return;}
  db.transaction(()=>{if(decision==='reject'){proposal.status='rejected';return;}if(existing){proposal.placeId=existing.id;proposal.status='approved';return;}
   const id='plc_'+proposal.id;const place:PlaceEntity={id,tags:[],name:proposal.name,category:proposal.category,categoryLabel:proposal.category,coordinates:proposal.coordinates,description:'Lieu proposé, informations à confirmer.',address:proposal.address||'À confirmer',commune:'À confirmer',neighborhood:'À confirmer',verificationStatus:'unverified',claimStatus:'unclaimed',isCertified:false,isSponsored:false,markerKind:undefined,mergedInto:undefined,localOverrides:undefined,isDemo:false,priceLevel:undefined,exploitationStatus:'unknown',coverImage:'/illustrations/venue-placeholder.svg',priceDescription:'Prix non renseignés'};db.getRawData().places.push(place);proposal.status='approved';proposal.placeId=id;db.touchPlaces();});res.json({proposal});
 });
}
