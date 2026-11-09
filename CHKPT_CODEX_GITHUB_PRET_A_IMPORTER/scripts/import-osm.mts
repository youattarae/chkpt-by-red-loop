import {readFile,stat,copyFile,writeFile,rename,rm} from 'node:fs/promises';
import path from 'node:path';
import {planOsmImport} from '../server/osmPlan';
const args=process.argv.slice(2);const arg=(name:string)=>{const v=args[args.indexOf(name)+1];if(!v||v.startsWith('--'))throw Error('Valeur manquante pour '+name);return v;};
if(!args.includes('--file')||!args.includes('--data-dir'))throw Error('Usage : npm run places:import -- --file extrait.json --data-dir /chemin/.data [--fixture] [--apply]. Sans --apply : aperçu sans écriture. Arrêter le serveur avant application.');
const inputFile=path.resolve(arg('--file')),dir=path.resolve(arg('--data-dir')),dbFile=path.join(dir,'chkpt_db.json');if((await stat(inputFile)).size>20_000_000)throw Error('Extrait trop volumineux (20 Mo maximum).');
const input=JSON.parse(await readFile(inputFile,'utf8'));let snapshot:any={places:[],place_sources:[]};try{snapshot=JSON.parse(await readFile(dbFile,'utf8'));}catch(e:any){if(e.code!=='ENOENT')throw e;}
const options={kind:args.includes('--fixture')?'fixture' as const:'osm' as const};const plan=planOsmImport(input,snapshot.places||[],snapshot.place_sources||[],options);
if(!args.includes('--apply'))console.log(JSON.stringify({dryRun:true,counts:plan.counts,rows:plan.rows.map(({key,decision,candidateIds,reason})=>({key,decision,candidateIds,reason}))},null,2));
else{
 // Keep the CLI independent from db.ts: loading the application DB rotates demo sessions.
 // Only the two repository tables and revision may change during an offline import.
 const tables=['users','sessions','places','checkins','checkin_proofs','points_ledger','follows','reports'];
 if(!tables.every(key=>Array.isArray(snapshot[key]))||new Set(snapshot.places.map((p:any)=>p.id)).size!==snapshot.places.length)throw Error('Base existante complète requise. Démarrer l’application une fois avant un import ; aucune écriture effectuée.');
 for(const row of plan.rows){if(!row.place||!row.source)continue;snapshot.places=snapshot.places.filter((p:any)=>p.id!==row.place!.id).concat(row.place);snapshot.place_sources=(snapshot.place_sources||[]).filter((s:any)=>s.key!==row.key).concat(row.source);}
 if(plan.counts.created||plan.counts.updated)snapshot.placesRevision=(snapshot.placesRevision||0)+1;
 await copyFile(dbFile,path.join(dir,'avant-import-'+Date.now()+'.json'));
 const temporary=dbFile+'.import-'+process.pid+'.tmp';
 try{await writeFile(temporary,JSON.stringify(snapshot,null,2),{mode:0o600});await rename(temporary,dbFile);}finally{await rm(temporary,{force:true});}
 console.log(JSON.stringify({applied:true,counts:plan.counts},null,2));
}
