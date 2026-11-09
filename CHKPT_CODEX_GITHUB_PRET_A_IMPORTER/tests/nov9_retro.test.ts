import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
export async function checkNov9Retro(start:any,stop:any,password:string){
 let server=await start('nov9-retro',true);
 const call=(path:string,token='',body?:unknown)=>fetch(server.url+path,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const json=async(r:Promise<Response>)=>{const response=await r;assert.ok(response.ok,await response.clone().text());return response.json();};let admin=(await json(call('/api/auth/login','',{username:'redloop_admin',password}))).token;
 const register=async(name:string)=>json(call('/api/auth/register','',{username:'retro_'+name,password,age:25}));const a=await register('a'),b=await register('b'),c=await register('c');
 const place=(await json(call('/api/places'))).places.find((p:any)=>p.id==='plc_demo_hotel');const draft={placeId:place.id,latitude:place.coordinates.lat,longitude:place.coordinates.lng,isSimulated:true,audience:'private'};
 const pending=await json(call('/api/checkins',a.token,draft));assert.equal(pending.status,'pending_validation');assert.equal(pending.awardedXp,0);assert.equal((await json(call('/api/account/state',a.token))).user.xpPoints,0);assert.equal((await call('/api/checkins',a.token,draft)).status,422);assert.equal((await call('/api/checkins',b.token,{...draft,latitude:0,longitude:0})).status,422);
 await json(call('/api/checkins',b.token,draft));assert.equal((await call('/api/operator/places/'+place.id+'/verification',a.token,{status:'verified'})).status,403);
 const values=await Promise.all([json(call('/api/operator/places/'+place.id+'/verification',admin,{status:'verified'})),json(call('/api/operator/places/'+place.id+'/verification',admin,{status:'verified'}))]);assert.equal(values.reduce((n,r)=>n+r.creditedXp,0),150);
 for(const actor of [a,b]){const state=await json(call('/api/account/state',actor.token));assert.equal(state.user.xpPoints,75);assert.equal(state.checkins[0].status,'verified');assert.equal(state.pointsLedger.filter((p:any)=>p.sourceAction==='CHECKIN_VERIFIED').length,1);assert.equal((await json(call('/api/experience',actor.token))).activity.filter((n:any)=>n.title.includes('XP crédités')).length,1);}
 assert.equal((await json(call('/api/experience',c.token))).activity.length,0);assert.equal((await json(call('/api/checkins/history',c.token))).checkins.length,0);
 const eventPlace=(await json(call('/api/places'))).places.find((p:any)=>p.id==='plc_demo_event');const check=await json(call('/api/checkins',c.token,{...draft,placeId:eventPlace.id,latitude:eventPlace.coordinates.lat,longitude:eventPlace.coordinates.lng}));assert.equal(check.awardedXp,0);await json(call('/api/operator/places/'+eventPlace.id+'/corrections',admin,{fields:{coordinates:{lat:eventPlace.coordinates.lat+.0001,lng:eventPlace.coordinates.lng}}}));const held=await json(call('/api/operator/places/'+eventPlace.id+'/verification',admin,{status:'verified'}));assert.equal(held.creditedXp,0);assert.equal(held.results[0].status,'manual_review');assert.equal((await json(call('/api/operator/places/checks/'+check.checkIn.id+'/review',admin,{approve:true,reason:'Preuve cohérente, faible correction du centre'}))).credited,75);assert.equal((await json(call('/api/operator/places/checks/'+check.checkIn.id+'/review',admin,{approve:true,reason:'Rejeu de la même décision'}))).credited,0);
 await stop(server.child);server=await start('nov9-retro',true);admin=(await json(call('/api/auth/login','',{username:'redloop_admin',password}))).token;assert.equal((await json(call('/api/operator/places/'+place.id+'/verification',admin,{status:'verified'}))).creditedXp,0);assert.equal((await json(call('/api/account/state',a.token))).user.xpPoints,75);
 // A later pending check on a rejected venue must never earn retroactive XP.
 await json(call('/api/operator/places/'+place.id+'/verification',admin,{status:'unverified'}));const d=await register('d');const reject=await json(call('/api/checkins',d.token,draft));assert.equal(reject.awardedXp,0);await json(call('/api/operator/places/'+place.id+'/verification',admin,{status:'rejected'}));assert.equal((await call('/api/checkins',d.token,draft)).status,422);await json(call('/api/operator/places/'+place.id+'/verification',admin,{status:'verified'}));assert.equal((await json(call('/api/account/state',d.token))).user.xpPoints,0);

 // Historical days and a corrupted same-day duplicate are evaluated in timestamp order.
 await json(call('/api/operator/places/'+place.id+'/verification',admin,{status:'unverified'}));
 const e=await register('historical'),f=await register('poor_accuracy');
 const historical=await json(call('/api/checkins',e.token,draft));
 const poor=await json(call('/api/checkins',f.token,{...draft,accuracyMeters:900}));
 await stop(server.child);
 const file=server.cwd+'/.data/chkpt_db.json',snapshot=JSON.parse(await readFile(file,'utf8'));
 const record=snapshot.checkins.find((x:any)=>x.id===historical.checkIn.id),proof=snapshot.checkin_proofs.find((x:any)=>x.checkinId===record.id);
 const day1=new Date(Date.now()-3*86400000).toISOString(),day2=new Date(Date.now()-2*86400000).toISOString();record.timestamp=day1;proof.timestamp=day1;
 snapshot.checkins.push({...structuredClone(record),id:'historical_second',timestamp:day2},{...structuredClone(record),id:'historical_same_day',timestamp:day2});
 snapshot.checkin_proofs.push({...structuredClone(proof),id:'historical_proof_second',checkinId:'historical_second',timestamp:day2},{...structuredClone(proof),id:'historical_proof_duplicate',checkinId:'historical_same_day',timestamp:day2});
 await writeFile(file,JSON.stringify(snapshot));server=await start('nov9-retro',true);admin=(await json(call('/api/auth/login','',{username:'redloop_admin',password}))).token;
 const credits=await json(call('/api/operator/places/'+place.id+'/verification',admin,{status:'verified'}));assert.equal(credits.creditedXp,125);
 const es=await json(call('/api/account/state',e.token));assert.equal(es.user.xpPoints,125);assert.deepEqual(es.pointsLedger.filter((x:any)=>x.sourceAction==='CHECKIN_VERIFIED').map((x:any)=>x.deltaXp).sort(),[50,75]);
 assert.equal(credits.results.filter((x:any)=>x.status==='manual_review').length,2,'Doublon quotidien et mauvaise précision restent sans crédit');
 assert.equal((await json(call('/api/operator/places/checks/'+poor.checkIn.id+'/review',admin,{approve:true,reason:'Tentative de contourner la précision'}))).credited,0);
 assert.equal((await json(call('/api/account/state',f.token))).user.xpPoints,0);
 await stop(server.child);
}
