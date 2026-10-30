import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import path from 'node:path';
import {mkdtemp,rm,symlink,readFile,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
export async function checkBuildExposure(start:any,stop:any,project:string,password:string){
 const server=await start('exposure',true);await symlink(path.join(project,'dist'),path.join(server.cwd,'dist'));
 try{
  const response=await fetch(server.url);assert.equal(response.status,200);assert.equal(response.headers.get('x-powered-by'),null);assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  for(const route of ['/src/App.tsx','/server.ts','/server/db.ts','/.env','/.data/chkpt_db.json','/.git/config','/docs/PRODUIT_ET_DECISIONS.md','/shared/badgeCatalog.ts','/package.json','/package-lock.json','/assets/debug.js.map','/@vite/client'])assert.equal((await fetch(server.url+route)).status,404,route);
  const unknown=await fetch(server.url+'/api/not-a-route');assert.equal(unknown.status,404);assert.equal((await unknown.json()).error,'not_found');
  const html=await response.text();const bundle=html.match(/src="(\/assets\/[^" ]+\.js)"/)![1];assert.equal((await fetch(server.url+bundle)).status,200);
  assert.equal((await fetch(server.url+bundle+'.map')).status,404);
  const assets=await readdir(path.join(project,'dist/assets'));assert.ok(!assets.some(file=>file.endsWith('.map')));
  for(const file of assets.filter(file=>file.endsWith('.js'))){const source=await readFile(path.join(project,'dist/assets',file),'utf8');assert.ok(!source.includes('sourceMappingURL='));assert.ok(!source.includes('hashSeedPassword'));assert.ok(!source.includes('CHKPT_DEMO_ADMIN_PASSWORD'));assert.ok(!source.includes('GEMINI_API_KEY'));}
  const malformed=await fetch(server.url+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:'{broken'});assert.equal(malformed.status,400);const text=await malformed.text();assert.ok(!text.includes('SyntaxError'));assert.ok(!text.includes('node_modules'));assert.equal(JSON.parse(text).error,'invalid_request');
  const account=await (await fetch(server.url+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'exposure_actor',password,age:25})})).json();
  assert.equal((await fetch(server.url+'/api/ads/adult-image')).status,401);
  assert.equal((await fetch(server.url+'/api/ads/adult-image',{headers:{Authorization:'Bearer '+account.token}})).status,200);
  const minor=await (await fetch(server.url+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'exposure_minor',password,age:16})})).json();
  assert.equal((await fetch(server.url+'/api/ads/adult-image',{headers:{Authorization:'Bearer '+minor.token}})).status,403);
  assert.equal((await fetch(server.url+'/server/assets/pub-biere-demo.webp')).status,404);
  assert.equal((await fetch(server.url+'/api/account/state?token='+account.token)).status,401,'Les jetons dans les URL ne connectent plus');
  assert.equal((await fetch(server.url+'/api/account/state',{headers:{Authorization:'Bearer '+account.token}})).status,200);
 }finally{await stop(server.child);}
 const cwd=await mkdtemp(path.join(tmpdir(),'chkpt-no-remote-dev-'));
 try{const child=spawn(process.execPath,['--import',path.join(project,'node_modules/tsx/dist/loader.mjs'),path.join(project,'server.ts')],{cwd,env:{...process.env,CHKPT_DATA_DIR:path.join(cwd,'.data'),NODE_ENV:'development',CHKPT_REMOTE_ACCESS:'true',CHKPT_PRIVATE_DEMO:'true',CHKPT_ACCESS_PASSWORD:'separate-visitor-test-only',CHKPT_DEMO_ADMIN_PASSWORD:password,PORT:'0',HOST:'127.0.0.1'},stdio:['ignore','pipe','pipe']});let logs='';child.stdout!.on('data',chunk=>logs+=chunk);child.stderr!.on('data',chunk=>logs+=chunk);const [code]=await once(child,'exit');assert.notEqual(code,0);assert.match(logs,/Remote demo requires NODE_ENV=production/);assert.ok(!logs.includes('running at'));}finally{await rm(cwd,{recursive:true,force:true});}
}
