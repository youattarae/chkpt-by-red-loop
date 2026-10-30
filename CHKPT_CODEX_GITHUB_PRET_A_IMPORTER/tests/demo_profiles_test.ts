import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {DEMO_PROFILES} from '../src/data/demoProfiles';
export async function checkDemoProfiles(start:any,stop:any,password:string){
 let server=await start('demo-profiles',true);
 const call=(route:string,body?:unknown,token?:string)=>fetch(server.url+route,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const checkCounts=async()=>{const posts=(await (await call('/api/posts')).json()).posts;for(const profile of DEMO_PROFILES){assert.equal(posts.filter((post:any)=>post.authorId===profile.id).length,5);assert.ok(posts.filter((post:any)=>post.authorId===profile.id).every((post:any)=>post.authorAvatar===profile.avatarUrl));}return posts;};
 await checkCounts();
 const owner=(await (await call('/api/auth/register',{username:'profile_migration_owner',password,age:25})).json());
 const post=(await (await call('/api/posts',{text:'Une publication personnelle à conserver.',clientRequestId:'demo-profiles-personal'},owner.token)).json()).post;
 const original=JSON.parse(await readFile(server.cwd+'/.data/chkpt_db.json','utf8'));
 await stop(server.child);
 // Simulate the prior demo: three starter posts, old labels, and no fourth persona.
 original.users=original.users.filter((user:any)=>user.id!=='usr_nadia');const yacoub=original.users.find((user:any)=>user.id==='usr_01');yacoub.username='koffi_urbex';yacoub.displayName='Koffi Kouamé';yacoub.avatarUrl='/illustrations/koffi.svg';
 original.posts=original.posts.filter((item:any)=>['pst_maquis_demo','pst_01','pst_02',post.id].includes(item.id));original.posts.find((item:any)=>item.id==='pst_maquis_demo').comments.push({id:'keep-comment',authorId:owner.user.id,authorName:'Compte de test',text:'À garder',createdAt:new Date().toISOString()});
 await writeFile(server.cwd+'/.data/chkpt_db.json',JSON.stringify(original));server=await start('demo-profiles',true);
 const migrated=await checkCounts();assert.ok(migrated.some((item:any)=>item.id===post.id&&item.text===post.text));assert.ok(migrated.find((item:any)=>item.id==='pst_maquis_demo').comments.some((comment:any)=>comment.id==='keep-comment'));
 await stop(server.child);server=await start('demo-profiles',true);const twice=await checkCounts();assert.equal(twice.length,21,'La migration est idempotente');
 const actor=(await (await call('/api/auth/login',{username:'profile_migration_owner',password})).json());
 for(const profile of DEMO_PROFILES){const viewed=await (await call('/api/profiles/'+profile.id,undefined,actor.token)).json();assert.equal(viewed.profile.displayName,profile.displayName);assert.ok(viewed.profile.bio.length>30);assert.ok(!('xpPoints' in viewed.profile));assert.ok(Array.isArray(viewed.profile.badges));}
 await stop(server.child);
}
