// Runs only as a child process in a dedicated temporary directory.
import assert from 'node:assert/strict';
import { db } from '../server/db';
import { evaluateBadges } from '../server/badgeEngine';
const data=db.getRawData();
const actor=data.users.find(user=>user.id==='usr_02')!;
for(let i=0;i<309;i++){
  const place={...data.places[0],id:`fixture_${i}`,category:i<100?'restaurants':i<200?'maquis':'culture_art',commune:i<300?'Cocody':`Commune ${i-299}`};
  data.places.push(place);
  const check={...data.checkins[0],id:`fixture_check_${i}`,userId:actor.id,placeId:place.id,placeCategory:place.category,status:'verified' as const,timestamp:new Date().toISOString()};
  data.checkins.push(check);
  data.points_ledger.push({id:`fixture_ledger_${i}`,userId:actor.id,sourceAction:'CHECKIN_VERIFIED',referenceId:check.id,amount:75,timestamp:check.timestamp});
}
for(let i=0;i<100;i++)data.points_ledger.push({id:`photo_${i}`,userId:actor.id,sourceAction:'PHOTO_PUBLISHED',referenceId:`unique_photo_${i}`,amount:0,timestamp:new Date().toISOString()});
for(let i=0;i<50;i++)data.points_ledger.push({id:`event_${i}`,userId:actor.id,sourceAction:'EVENT_ATTENDED',referenceId:`event_${i}`,amount:0,timestamp:new Date().toISOString()});
const first=evaluateBadges(actor.id);
assert.equal(first.badges.length,40);assert.equal(first.newlyUnlocked.length,40);
assert.ok(first.badges.every(badge=>badge.isUnlocked));
assert.equal(evaluateBadges(actor.id).newlyUnlocked.length,0);
assert.equal(data.points_ledger.filter(entry=>entry.sourceAction==='BADGE_UNLOCKED'&&entry.userId===actor.id).length,40);
assert.ok(data.points_ledger.filter(entry=>entry.sourceAction==='BADGE_UNLOCKED').every(entry=>entry.amount===0));
const unaffected=evaluateBadges('usr_sarah');assert.ok(unaffected.badges.every(badge=>!badge.isUnlocked));
console.log('40 paliers dans 8 familles : preuves serveur et journalisation idempotente OK');
