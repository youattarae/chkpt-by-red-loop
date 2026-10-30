import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {DEMO_PROFILES} from '../src/data/demoProfiles';
export async function checkDemoProfileBrowsers(url:string,password:string){
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});
 try{
  const registered=await (await fetch(url+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'four_profiles_'+Date.now(),password,age:25})})).json();
  const context=await browser.newContext({viewport:{width:390,height:950},reducedMotion:'reduce'});await context.addInitScript(token=>localStorage.setItem('chkpt_session_token',token),registered.token);const page=await context.newPage();await page.goto(url);
  const feed=page.getByRole('tabpanel',{name:'Pour toi',exact:true});await feed.getByRole('article').first().waitFor();await page.locator('[data-demo-ad] img[src^="blob:"]').waitFor();
  const blocks=await feed.locator('article,[data-demo-ad]').evaluateAll(elements=>elements.map(element=>element.tagName==='ARTICLE'?'post':'ad'));
  let count=0;for(const block of blocks){if(block==='post')count++;else assert.equal(count%5,0);}assert.ok(count>=20);assert.equal(blocks.filter(block=>block==='ad').length,Math.floor(count/5));
  assert.equal(new Set(await page.locator('[data-demo-ad] img').evaluateAll(images=>images.map(image=>(image as HTMLImageElement).src))).size,5);
  for(const ad of await page.locator('[data-demo-ad]').all())assert.equal(await ad.locator('a,button,[role="button"]').count(),0);
  if(process.env.CHKPT_CAPTURE_DIR){await mkdir(process.env.CHKPT_CAPTURE_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,'accueil-quatre-profils-390.png')});let number=0;for(const ad of await page.locator('[data-demo-ad]').all()){await ad.locator('img').evaluate(async element=>{await (element as HTMLImageElement).decode();});await ad.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,`publicite-demo-${number++}.png`),style:'nav,header[aria-label="En-tête CHKPT"]{visibility:hidden!important}'});}}
  for(const profile of DEMO_PROFILES){
    await feed.getByRole('button',{name:profile.displayName,exact:true}).first().click();const view=page.getByRole('region',{name:'Profil de la communauté',exact:true});await view.getByRole('heading',{name:profile.displayName,exact:true,level:1}).waitFor();
    assert.equal(await view.getByRole('article').count(),5);assert.equal(await view.getByText(/XP au total/).count(),0);await view.getByRole('region',{name:'Badges publics',exact:true}).waitFor();const photo=view.locator('img[src="'+profile.avatarUrl+'"]').first();await photo.waitFor();await photo.evaluate(async element=>{await (element as HTMLImageElement).decode();});assert.ok(await photo.evaluate(element=>(element as HTMLImageElement).naturalWidth>0));
    if(process.env.CHKPT_CAPTURE_DIR)await page.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,`profil-demo-${profile.id}-390.png`)});
    await view.getByRole('button',{name:'Retour',exact:true}).click();
  }
  await context.close();
  const minor=await (await fetch(url+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'minor_ads_'+Date.now(),password,age:16})})).json();
  const minorContext=await browser.newContext({viewport:{width:390,height:950}});await minorContext.addInitScript(token=>localStorage.setItem('chkpt_session_token',token),minor.token);const minorPage=await minorContext.newPage();await minorPage.goto(url);await minorPage.getByRole('button',{name:'Profil',exact:true}).click();await minorPage.getByRole('heading',{name:minor.user.displayName,exact:true,level:1}).waitFor();await minorPage.getByRole('button',{name:'Accueil',exact:true}).click();assert.equal(await minorPage.locator('[data-demo-ad]').filter({hasText:'Brise Lagune'}).count(),0);assert.equal(await minorPage.locator('img[src="/api/ads/adult-image"]').count(),0);await minorContext.close();
 }finally{await browser.close();}
}
