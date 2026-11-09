import {openMenu} from './browser_ui';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
export async function checkMessages(url:string,password:string){
 const api=async(route:string,token='',body?:unknown)=>fetch(url+route,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const register=async(username:string,age=24)=>{const r=await api('/api/auth/register','',{username,password,age,displayName:username==='dm_alice'?'Bintou Essehi':username==='dm_bob'?'Yacoub Ouattara':username});assert.equal(r.status,201);return r.json();};
 const admin=(await (await api('/api/auth/login','',{username:'redloop_admin',password})).json()).token;
 const a=await (await api('/api/auth/switch-demo',admin,{username:'usr_sarah'})).json(),b=await (await api('/api/auth/switch-demo',admin,{username:'usr_01'})).json(),c=await register('dm_charles'),minor=await register('dm_mineur',16);
 const me=await (await api('/api/auth/me',b.token)).json();const peer=me.user.id;
 assert.equal((await api('/api/messages')).status,401);
 const body={text:'Bonjour Ingrid, rendez-vous à Cocody ?',clientRequestId:'message_test_001'};
 const first=await api('/api/messages/'+peer,a.token,body);assert.equal(first.status,201);
 assert.equal((await api('/api/messages/'+peer,a.token,body)).status,200);
 const list=await (await api('/api/messages',b.token)).json();assert.equal(list.conversations[0].unread,1);
 assert.equal((await (await api('/api/messages/'+peer,a.token)).json()).messages.length,1);
 assert.equal((await (await api('/api/messages',c.token)).json()).conversations.length,0);
 assert.equal((await (await api('/api/messages/'+peer,c.token)).json()).messages.length,0);
 assert.equal((await api('/api/messages/'+peer,minor.token,body)).status,404);
 assert.equal((await api('/api/messages/'+peer,a.token,{...body,text:'x'.repeat(2001)})).status,400);
 const self=(await (await api('/api/auth/me',a.token)).json()).user.id;assert.equal((await api('/api/messages/'+self,a.token,body)).status,404);
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,headless:true});
 try{
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();await page.addInitScript(token=>localStorage.setItem('chkpt_session_token',token),b.token);
 await page.goto(url);await page.getByRole('tab',{name:'Pour toi',exact:true}).waitFor();
 await openMenu(page);
 const menu=page.getByRole('dialog',{name:'Mon menu'});await menu.waitFor();assert.equal(Math.round((await menu.boundingBox())!.x),0);await menu.locator('img').waitFor();await page.screenshot({path:'/tmp/chkpt-dm-menu.png'});
 assert.equal(await menu.getByRole('button',{name:'Messages privés',exact:true}).count(),0);await menu.getByRole('button',{name:'Fermer mon menu'}).click();await page.locator('nav').getByRole('button',{name:'Messages',exact:true}).click();await page.getByRole('button',{name:/Bintou Essehi/}).click();
 await page.locator('[aria-label="Conversation"]').getByText(body.text,{exact:true}).waitFor();await page.getByLabel('Votre message',{exact:true}).fill('Oui, à tout à l’heure !');await page.getByRole('button',{name:'Envoyer',exact:true}).click();await page.locator('[aria-label="Conversation"]').getByText('Oui, à tout à l’heure !',{exact:true}).waitFor();
 await page.screenshot({path:'/tmp/chkpt-dm-conversation.png'});
 await page.reload();await page.locator('[aria-label="Conversation"]').getByText('Oui, à tout à l’heure !',{exact:true}).waitFor();
 const owner=(await (await api('/api/auth/me',a.token)).json()).user.id;
 assert.equal((await (await api('/api/messages/'+owner,b.token)).json()).messages.length,2);
 assert.equal((await (await api('/api/messages',b.token)).json()).conversations[0].unread,0);
 const second=await browser.newContext({viewport:{width:390,height:844}});const other=await second.newPage();await other.addInitScript(token=>localStorage.setItem('chkpt_session_token',token),a.token);await other.goto(url+'/#page=conversation&id='+peer+'&tab=feed');await other.getByText('Oui, à tout à l’heure !',{exact:true}).waitFor();await second.close();
 await context.close();
 }finally{await browser.close();}
}
