import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {planOsmImport} from '../server/osmPlan';
import {geographicStyle} from '../shared/mapStyle';
import {radarPolygon,MARKER_KINDS,markerPresentation} from '../shared/mapMarkers';
import {calculateDistanceMeters} from '../src/services/geoService';
export async function checkNov9Places(start:any,stop:any,password:string){
 let server=await start('nov9-places',true);
 const call=(path:string,token='',body?:unknown)=>fetch(server.url+path,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const json=async(r:Promise<Response>)=>{const response=await r;assert.ok(response.ok,await response.clone().text());return response.json();};
 let admin=(await json(call('/api/auth/login','',{username:'redloop_admin',password}))).token;
 const user=await json(call('/api/auth/register','',{username:'nov9_places_user',password,age:24}));
 const fixture=JSON.parse(await readFile(new URL('./fixtures/cocody-osm-synthetic.json',import.meta.url),'utf8'));
 const file=server.cwd+'/.data/chkpt_db.json',before=await readFile(file);const preview=await json(call('/api/operator/places/import-osm',admin,{extract:fixture,sourceKind:'fixture',apply:false}));assert.equal(preview.counts.created,3);assert.equal(preview.counts.skipped,2);assert.deepEqual(await readFile(file),before,'Le dry-run ne modifie aucun octet');
 assert.equal((await call('/api/operator/places/import-osm',user.token,{extract:fixture,sourceKind:'fixture',apply:true})).status,403);
 const imported=await json(call('/api/operator/places/import-osm',admin,{extract:fixture,sourceKind:'fixture',apply:true}));const ids=imported.rows.filter((r:any)=>r.place).map((r:any)=>r.place.id);assert.equal(new Set(ids).size,3);
 const repeat=await json(call('/api/operator/places/import-osm',admin,{extract:fixture,sourceKind:'fixture',apply:true}));assert.equal(repeat.counts.created,0);assert.equal(repeat.counts.updated,3);let repository=await json(call('/api/operator/places',admin));assert.equal(repository.sources.length,3);assert.ok(repository.sources.every((s:any)=>s.provider==='fixture'&&s.license==='CC0-test-fixture'));
 const cafe=imported.rows.find((r:any)=>r.source?.objectId==='91000001').place;
 await json(call('/api/operator/places/'+cafe.id+'/corrections',admin,{fields:{name:'Correction locale à garder'}}));const newer=structuredClone(fixture);newer.elements[0].version=2;newer.elements[0].tags.name='Nom OSM plus récent';await json(call('/api/operator/places/import-osm',admin,{extract:newer,sourceKind:'fixture',apply:true}));repository=await json(call('/api/operator/places',admin));assert.equal(repository.places.find((p:any)=>p.id===cafe.id).name,'Correction locale à garder');assert.equal(repository.sources.find((s:any)=>s.placeId===cafe.id).lastValues.name,'Nom OSM plus récent');
 const proposalDraft={name:'Correction locale à garder',category:'cafes_boulangeries',coordinates:cafe.coordinates,clientRequestId:'nov9_proposal_001'};const p=(await json(call('/api/places/proposals',user.token,proposalDraft))).proposal;assert.ok(p.candidates.includes(cafe.id));assert.equal((await json(call('/api/places/proposals',user.token,proposalDraft))).proposal.id,p.id);assert.equal((await call('/api/operator/places/proposals/'+p.id+'/review',admin,{decision:'approve'})).status,409);await json(call('/api/operator/places/proposals/'+p.id+'/review',admin,{decision:'link',existingPlaceId:cafe.id}));
 const second=imported.rows.find((r:any)=>r.source?.objectId==='91000003').place;
 await json(call('/api/account/saved-places',user.token,{placeId:second.id,saved:true}));const post=(await json(call('/api/posts',user.token,{text:'À conserver après fusion',linkedPlaceId:second.id,clientRequestId:'nov9_merge_post_1'}))).post;
 const mergePreview=await json(call('/api/operator/places/merge',admin,{fromId:second.id,toId:cafe.id,apply:false}));assert.equal(mergePreview.posts,1);assert.equal(mergePreview.favorites,1);await json(call('/api/operator/places/merge',admin,{fromId:second.id,toId:cafe.id,apply:true,confirmation:'MERGE'}));const state=await json(call('/api/account/state',user.token));assert.equal(state.posts.find((p:any)=>p.id===post.id).linkedPlaceId,cafe.id);assert.deepEqual(state.savedPlaceIds,[cafe.id]);assert.equal(state.user.xpPoints,0);assert.equal((await json(call('/api/places'))).aliases[second.id],cafe.id);
 await stop(server.child);server=await start('nov9-places',true);admin=(await json(call('/api/auth/login','',{username:'redloop_admin',password}))).token;repository=await json(call('/api/operator/places',admin));assert.equal(repository.places.find((p:any)=>p.id===cafe.id).name,'Correction locale à garder');assert.equal(repository.sources.length,3);assert.ok(repository.sources.some((s:any)=>s.placeId===cafe.id&&s.objectId==='91000003'));
 const defaultPlan=planOsmImport(fixture,[],[],{kind:'osm'});assert.equal(defaultPlan.rows[0].source?.license,'ODbL-1.0');assert.equal(defaultPlan.rows[0].source?.sourceUrl,'https://www.openstreetmap.org/node/91000001');
 const clean=geographicStyle({layers:[{id:'road-label',type:'symbol','source-layer':'transportation_name'},{id:'poi-business',type:'symbol','source-layer':'poi'},{id:'unknown',type:'symbol'},{id:'road-fill',type:'line'}]});assert.deepEqual(clean.layers.map(l=>l.id),['road-label','road-fill']);assert.equal(MARKER_KINDS.length,7);const m=markerPresentation({category:'autre',markerKind:'hotel',verificationStatus:'unverified',isSponsored:true});assert.equal(m.verified,false);assert.equal(m.sponsored,true);for(const [lng,lat]of radarPolygon(5.35,-4.0))assert.ok(Math.abs(calculateDistanceMeters({lat,lng},{lat:5.35,lng:-4.0})-250)<2);

 await stop(server.child);
 const project=fileURLToPath(new URL('..',import.meta.url));
 const cli=(apply=false)=>promisify(execFile)(process.execPath,['--import',path.join(project,'node_modules/tsx/dist/loader.mjs'),path.join(project,'scripts/import-osm.mts'),'--file',fileURLToPath(new URL('./fixtures/cocody-osm-synthetic.json',import.meta.url)),'--data-dir',server.cwd+'/.data','--fixture',...(apply?['--apply']:[])],{cwd:server.cwd,env:{...process.env,CHKPT_PRIVATE_DEMO:'false',CHKPT_REMOTE_ACCESS:'false'}});
 const beforeCli=await readFile(file);assert.equal(JSON.parse((await cli()).stdout).dryRun,true);assert.deepEqual(await readFile(file),beforeCli,'CLI dry-run strictement sans écriture');
 assert.equal(JSON.parse((await cli(true)).stdout).applied,true);const afterCli=JSON.parse(await readFile(file,'utf8'));for(const table of ['users','sessions','posts','messages','stories','checkins','checkin_proofs','points_ledger','media'])assert.deepEqual(afterCli[table],JSON.parse(beforeCli.toString())[table],'CLI conserve '+table);
 server=await start('nov9-places',true);admin=(await json(call('/api/auth/login','',{username:'redloop_admin',password}))).token;repository=await json(call('/api/operator/places',admin));assert.equal(repository.sources.length,3);assert.equal(repository.places.find((p:any)=>p.id===cafe.id).name,'Correction locale à garder');

 // Event links and eligibility also resolve aliases after a manual canonical merge.
 await json(call('/api/operator/places/merge',admin,{fromId:'plc_maquis_etoile',toId:cafe.id,apply:true,confirmation:'MERGE'}));
 assert.deepEqual(repository.places.find((p:any)=>p.id===cafe.id).coordinates,cafe.coordinates,'Une source fusionnée ne doit pas déplacer la fiche conservée');
 const active=(await json(call('/api/events'))).events.find((e:any)=>e.id.startsWith('evt_demo_'));assert.equal(active.placeId,cafe.id);assert.equal(active.locationName,'Correction locale à garder');
 const eventCheck=await json(call('/api/checkins',user.token,{placeId:cafe.id,latitude:cafe.coordinates.lat,longitude:cafe.coordinates.lng,isSimulated:true,audience:'private',eventId:active.id}));assert.equal(eventCheck.status,'pending_validation');
 await json(call('/api/operator/places/'+cafe.id+'/verification',admin,{status:'verified'}));assert.ok((await json(call('/api/account/state',user.token))).pointsLedger.some((e:any)=>e.sourceAction==='EVENT_ATTENDED'&&e.referenceId===active.id));
 await stop(server.child);
}
