import assert from 'node:assert/strict';
import {chromium,BrowserContext} from 'playwright';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
export async function checkStoryBrowsers(url:string,password:string){
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});const contexts:BrowserContext[]=[];
  try{
    const actor=await (await fetch(url+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'story_browser_'+Date.now(),displayName:'Alex · profil fictif',password,age:25})})).json();
    async function device(token:string){const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});contexts.push(context);await context.addInitScript(token=>localStorage.setItem('chkpt_session_token',token),token);const page=await context.newPage();await page.goto(url);return page;}
    const page=await device(actor.token);await page.getByRole('button',{name:'Profil',exact:true}).click();
    await page.getByRole('button',{name:'Ajouter une story',exact:true}).click();
    const composer=page.getByRole('dialog',{name:'Ajouter une story',exact:true});
    await composer.getByLabel('Images ou vidéos de la publication').setInputFiles(new URL('../public/illustrations/maquis-braise-demo.png',import.meta.url).pathname);
    await composer.getByText('1/1 médias',{exact:false}).waitFor();await composer.getByLabel('Texte facultatif').fill('Ma première story de démonstration.');
    await composer.getByRole('button',{name:'Publier la story',exact:true}).click();await composer.waitFor({state:'detached'});
    await page.getByRole('button',{name:`Voir les stories de ${actor.user.displayName}`,exact:true}).click();
    let viewer=page.getByRole('dialog',{name:`Stories de ${actor.user.displayName}`,exact:true});
    await viewer.getByText('Ma première story de démonstration.',{exact:true}).waitFor();await viewer.locator('img[src^="blob:"]').waitFor();
    if(process.env.CHKPT_CAPTURE_DIR){await mkdir(process.env.CHKPT_CAPTURE_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,'story-lecture-390.png')});}
    await page.keyboard.press('Escape');await viewer.waitFor({state:'detached'});
    await page.getByRole('button',{name:'Accueil',exact:true}).click();await page.getByRole('region',{name:'Stories',exact:true}).getByRole('button',{name:`Voir les stories de ${actor.user.displayName}`,exact:true}).click();
    await viewer.waitFor();await viewer.getByRole('button',{name:'Fermer les stories',exact:true}).click();
    const second=await device(actor.token);await second.getByRole('region',{name:'Stories',exact:true}).getByRole('button',{name:`Voir les stories de ${actor.user.displayName}`,exact:true}).click();
    await second.getByRole('dialog').getByText('Ma première story de démonstration.',{exact:true}).waitFor();await second.getByRole('button',{name:'Fermer les stories',exact:true}).click();
    // An outsider reaches the same story from both the publication avatar and the public profile.
    const posted=await fetch(url+'/api/posts',{method:'POST',headers:{Authorization:`Bearer ${actor.token}`,'Content-Type':'application/json'},body:JSON.stringify({text:'Le profil et sa story.',clientRequestId:'story-browser-post'})});assert.equal(posted.status,201);
    const outsider=await (await fetch(url+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'story_reader_'+Date.now(),password,age:25})})).json();const other=await device(outsider.token);
    const post=other.getByRole('article').filter({hasText:'Le profil et sa story.'});await post.getByRole('button',{name:`Voir les stories de ${actor.user.displayName}`,exact:true}).click();await other.getByRole('dialog').getByText('Ma première story de démonstration.',{exact:true}).waitFor();assert.equal(await other.getByRole('button',{name:'Supprimer cette story',exact:true}).count(),0);await other.getByRole('button',{name:'Fermer les stories',exact:true}).click();
    await post.getByRole('button',{name:actor.user.displayName,exact:true}).click();const profile=other.getByRole('dialog',{name:'Profil de la communauté',exact:true});await profile.getByRole('button',{name:`Voir les stories de ${actor.user.displayName}`,exact:true}).first().click();await other.getByRole('dialog',{name:`Stories de ${actor.user.displayName}`,exact:true}).waitFor();await other.keyboard.press('Escape');await profile.waitFor();
    // Owner deletes; the direct URL and subsequent clients can no longer retrieve the media.
    await page.getByRole('region',{name:'Stories',exact:true}).getByRole('button',{name:`Voir les stories de ${actor.user.displayName}`,exact:true}).click();await viewer.getByRole('button',{name:'Supprimer cette story',exact:true}).click();await viewer.waitFor({state:'detached'});
    await second.reload();await second.getByRole('region',{name:'Stories',exact:true}).getByRole('button',{name:`Voir le profil de ${actor.user.displayName}`,exact:true}).waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }finally{for(const context of contexts)await context.close();await browser.close();}
}
