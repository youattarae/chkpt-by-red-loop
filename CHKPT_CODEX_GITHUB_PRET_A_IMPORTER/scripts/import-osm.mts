import {readFile,stat,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {planOsmImport} from '../server/osmPlan';
const args=process.argv.slice(2);const arg=(name:string)=>{const v=args[args.indexOf(name)+1];if(!v||v.startsWith('--'))throw Error('Valeur manquante pour '+name);return v;};
if(!args.includes('--file')||!args.includes('--data-dir'))throw Error('Usage : npm run places:import -- --file extrait.json --data-dir /chemin/.data [--fixture] [--apply]. Sans --apply : aperçu sans écriture. Arrêter le serveur avant application.');
const inputFile=path.resolve(arg('--file')),dir=path.resolve(arg('--data-dir')),dbFile=path.join(dir,'chkpt_db.json');if((await stat(inputFile)).size>20_000_000)throw Error('Extrait trop volumineux (20 Mo maximum).');
const input=JSON.parse(await readFile(inputFile,'utf8'));let snapshot:any={places:[],place_sources:[]};try{snapshot=JSON.parse(await readFile(dbFile,'utf8'));}catch(e:any){if(e.code!=='ENOENT')throw e;}
const options={kind:args.includes('--fixture')?'fixture' as const:'osm' as const};const plan=planOsmImport(input,snapshot.places||[],snapshot.place_sources||[],options);
if(!args.includes('--apply'))console.log(JSON.stringify({dryRun:true,counts:plan.counts,rows:plan.rows.map(({key,decision,candidateIds,reason})=>({key,decision,candidateIds,reason}))},null,2));
else{await mkdir(dir,{recursive:true});try{await copyFile(dbFile,path.join(dir,'avant-import-'+Date.now()+'.json'));}catch(e:any){if(e.code!=='ENOENT')throw e;}process.env.CHKPT_DATA_DIR=dir;const {importOsm}=await import('../server/placeRepository');const result=importOsm(input,options,true);console.log(JSON.stringify({applied:true,counts:result.counts},null,2));}
