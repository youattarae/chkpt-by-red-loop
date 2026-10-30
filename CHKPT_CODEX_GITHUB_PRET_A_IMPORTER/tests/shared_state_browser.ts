import assert from 'node:assert/strict';
import { chromium, BrowserContext } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
export async function checkSharedBrowsers(url:string,password:string){
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});
  const contexts:BrowserContext[]=[];
  try{
    const registered=await fetch(url+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'multi_browser_'+Date.now(),displayName:'Alex · compte de démonstration',password,age:25})});
    assert.equal(registered.status,201);const actor=await registered.json();
    const second=await (await fetch(url+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:actor.user.username,password})})).json();
    async function device(token:string){const context=await browser.newContext({viewport:{width:390,height:950},reducedMotion:'reduce'});contexts.push(context);await context.addInitScript(({token,user})=>{localStorage.setItem('chkpt_session_token',token);localStorage.setItem('chkpt_abidjan_v1_user',JSON.stringify(user));},{token,user:actor.user});const page=await context.newPage();page.setDefaultTimeout(15000);await page.goto(url);return page;}
    const first=await device(actor.token),other=await device(second.token);
    await other.getByRole('button',{name:'Profil',exact:true}).click();
    await first.bringToFront();await first.getByRole('button',{name:/Qu’as-tu découvert/}).click();
    const message='Une découverte partagée entre deux appareils.';
    await first.getByPlaceholder('Partage tes bonnes adresses, tes coups de cœur…',{exact:true}).fill(message);
    await first.getByRole('button',{name:'Publier',exact:true}).click();
    await first.getByRole('article').getByText(message,{exact:true}).waitFor();
    const maquis=first.getByRole('article').filter({hasText:'Une belle découverte à Cocody'});
    await maquis.getByRole('button',{name:'Enregistrer le lieu de cette publication',exact:true}).click();
    await other.bringToFront();await other.evaluate(()=>window.dispatchEvent(new Event('focus')));
    await other.getByRole('region',{name:'Mes publications',exact:true}).getByText(message,{exact:true}).waitFor();
    await other.getByRole('button',{name:'Ouvrir mon menu'}).click();await other.getByRole('dialog',{name:'Mon menu'}).getByRole('button',{name:'Lieux enregistrés',exact:true}).click();
    await other.getByRole('region',{name:'Mes lieux enregistrés',exact:true}).getByRole('button',{name:/Maquis L.Étoile/}).waitFor();
    await first.bringToFront();await first.getByRole('button',{name:'Valider ma présence physique',exact:true}).click();
    const check=first.getByRole('dialog',{name:'Check-in',exact:true});await check.getByRole('button',{name:/Maquis L'Étoile/}).click();await check.getByRole('button',{name:'Confirmer le check',exact:true}).click();
    await check.getByRole('heading',{name:'Visite simulée enregistrée !',exact:true}).waitFor();await check.getByRole('button',{name:'Plus tard (Terminer)',exact:true}).click();
    await other.bringToFront();await other.getByRole('button',{name:'Profil',exact:true}).click();await other.evaluate(()=>window.dispatchEvent(new Event('focus')));await other.getByText('75 XP au total',{exact:true}).waitFor();
    await other.getByRole('button',{name:'Ouvrir mon menu'}).click();await other.getByRole('dialog',{name:'Mon menu'}).getByRole('button',{name:'Historique privé'}).click();
    await other.getByRole('region',{name:'Historique des lieux visités',exact:true}).getByRole('button',{name:/Maquis L.Étoile/}).waitFor();
    const upload=await (await fetch(url+'/api/media/upload',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${actor.token}`},body:JSON.stringify({mimeType:'image/png',audience:'private',dataBase64:'data:image/png;base64,'+(await readFile(new URL('../public/illustrations/maquis-demo.png',import.meta.url))).toString('base64')})})).json();
    const privateText='Photo privée visible sur mes deux appareils.';
    const posted=await fetch(url+'/api/posts',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${actor.token}`},body:JSON.stringify({text:privateText,mediaUrl:upload.readUrl,audience:'private',clientRequestId:'browser-private-001'})});assert.equal(posted.status,201);
    await other.getByRole('button',{name:'Profil',exact:true}).click();await other.evaluate(()=>window.dispatchEvent(new Event('focus')));
    const privatePost=other.getByRole('article').filter({hasText:privateText});await privatePost.waitFor();
    await privatePost.locator('img[src^="blob:"]').waitFor();
    assert.ok(await privatePost.locator('img[src^="blob:"]').evaluate(image=>(image as HTMLImageElement).naturalWidth>0));
    await other.getByRole('button',{name:'Ouvrir mon menu'}).click();await other.getByRole('dialog',{name:'Mon menu'}).getByRole('button',{name:'Badges et progression'}).click();
    const badges=other.getByRole('region',{name:'Badges et progression',exact:true});assert.ok(await badges.getByRole('heading',{level:4}).count()<=6);
    if(process.env.CHKPT_CAPTURE_DIR){await mkdir(process.env.CHKPT_CAPTURE_DIR,{recursive:true});await badges.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,'badges-selection-390.png')});}
    await first.bringToFront();await first.getByRole('button',{name:/Qu’as-tu découvert/}).click();
    const retry='Ma publication doit résister à une réponse perdue.';
    await first.getByPlaceholder('Partage tes bonnes adresses, tes coups de cœur…',{exact:true}).fill(retry);
    let nonce='';await first.route('**/api/posts',async route=>{if(route.request().method()!=='POST'){await route.continue();return;}nonce=route.request().postDataJSON().clientRequestId;await route.fetch();await route.abort();},{times:1});
    await first.getByRole('button',{name:'Publier',exact:true}).click();
    await first.getByRole('alert').getByText(/Action non confirmée/).waitFor();assert.equal(await first.getByPlaceholder('Partage tes bonnes adresses, tes coups de cœur…',{exact:true}).inputValue(),retry);
    const resent=first.waitForRequest(request=>request.url()===url+'/api/posts'&&request.method()==='POST');await first.getByRole('button',{name:'Publier',exact:true}).click();assert.equal((await resent).postDataJSON().clientRequestId,nonce);
    await first.getByRole('article').getByText(retry,{exact:true}).waitFor();
    const serverPosts=await (await fetch(url+'/api/posts',{headers:{Authorization:`Bearer ${actor.token}`}})).json();assert.equal(serverPosts.posts.filter((post:any)=>post.text===retry).length,1);
    await other.bringToFront();await other.getByRole('button',{name:'Profil',exact:true}).click();await other.evaluate(()=>window.dispatchEvent(new Event('focus')));await other.getByRole('region',{name:'Mes publications',exact:true}).getByText(retry,{exact:true}).waitFor();
    if(process.env.CHKPT_CAPTURE_DIR)await other.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,'synchronisation-profil-390.png')});
    const strangerResponse=await fetch(url+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'other_browser_'+Date.now(),password,age:25})});const stranger=await strangerResponse.json();
    let release!:()=>void,ready!:()=>void;const held=new Promise<void>(resolve=>{release=resolve;}),captured=new Promise<void>(resolve=>{ready=resolve;});let intercepted=false;
    await other.route('**/api/account/state',async route=>{if(intercepted||route.request().headers().authorization!==`Bearer ${second.token}`){await route.continue();return;}intercepted=true;const response=await route.fetch();ready();await held;await route.fulfill({response});});
    await other.evaluate(()=>window.dispatchEvent(new Event('focus')));await captured;
    await other.getByRole('button',{name:'Profil',exact:true}).click();await other.getByRole('button',{name:'Gérer mon compte',exact:true}).click();await other.getByRole('button',{name:'Connexion',exact:true}).click();await other.getByPlaceholder('ex: yacoub_ouattara').fill(stranger.user.username);await other.locator('input[type=password]').fill(password);await other.getByRole('button',{name:'Se connecter',exact:true}).click();
    await other.getByRole('heading',{name:stranger.user.displayName,exact:true,level:1}).waitFor();const oldResponse=other.waitForResponse(response=>response.url()===url+'/api/account/state'&&response.request().headers().authorization===`Bearer ${second.token}`);release();await (await oldResponse).finished();await other.evaluate('new Promise(resolve => requestAnimationFrame(resolve))');await other.unroute('**/api/account/state');
    assert.equal(await other.getByRole('region',{name:'Mes publications',exact:true}).getByText(privateText,{exact:true}).count(),0);
    await other.getByRole('button',{name:'Ouvrir mon menu'}).click();await other.getByRole('dialog',{name:'Mon menu'}).getByRole('button',{name:'Historique privé'}).click();await other.getByRole('region',{name:'Historique des lieux visités',exact:true}).getByText(/Aucun lieu visité/).waitFor();
    await other.getByRole('button',{name:'Profil',exact:true}).click();await other.getByRole('button',{name:'Gérer mon compte',exact:true}).click();await other.getByRole('button',{name:'Connexion',exact:true}).click();await other.getByPlaceholder('ex: yacoub_ouattara').fill('redloop_admin');await other.locator('input[type=password]').fill(password);await other.getByRole('button',{name:'Se connecter',exact:true}).click();
    await other.getByRole('heading',{name:'Superviseur RED LOOP',exact:true,level:1}).waitFor();await other.getByRole('button',{name:'Réglages',exact:true}).click();await other.getByText('Sauvegarde privée de la démo',{exact:true}).click();
    if(process.env.CHKPT_CAPTURE_DIR)await other.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,'sauvegarde-privee-390.png')});
    await other.getByLabel('Mot de passe de sauvegarde',{exact:true}).fill('backup-browser-test-123');const download=other.waitForEvent('download');await other.getByRole('button',{name:'Télécharger une sauvegarde chiffrée',exact:true}).click();assert.match((await download).suggestedFilename(),/\.chkpt$/);
    const operatorToken=await other.evaluate(()=>localStorage.getItem('chkpt_session_token'));
    await other.getByRole('button',{name:'Fermer les réglages',exact:true}).click();await other.getByRole('button',{name:'Gérer mon compte',exact:true}).click();await other.getByRole('button',{name:'Se déconnecter de cet appareil',exact:true}).click();
    await other.waitForFunction(()=>!localStorage.getItem('chkpt_session_token'));
    assert.equal((await fetch(url+'/api/account/state',{headers:{Authorization:`Bearer ${operatorToken}`}})).status,401);
    assert.equal(await other.getByText(privateText,{exact:true}).count(),0);


  }finally{for(const context of contexts)await context.close();await browser.close();}
}
