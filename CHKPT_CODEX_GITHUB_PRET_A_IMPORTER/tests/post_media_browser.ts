import assert from 'node:assert/strict';
import {chromium} from 'playwright';
export async function checkPostMedia(url:string,password:string){
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});
  try{
    const response=await fetch(url+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'media_browser_'+Date.now(),password,age:25})});assert.equal(response.status,201);const actor=await response.json();
    const context=await browser.newContext({viewport:{width:390,height:900}});
    await context.addInitScript(token=>localStorage.setItem('chkpt_session_token',token),actor.token);
    const page=await context.newPage();await page.goto(url);
    await page.getByRole('button',{name:/Qu’as-tu découvert/}).click();
    await page.getByPlaceholder('Partage tes bonnes adresses, tes coups de cœur…',{exact:true}).fill('Mon album photo et vidéo.');
    const input=page.getByLabel('Images ou vidéos de la publication');
    await input.setInputFiles([new URL('../public/illustrations/maquis-demo.png',import.meta.url).pathname,new URL('./fixtures/blue-demo.mp4',import.meta.url).pathname]);
    await page.getByText('2/4 médias',{exact:false}).waitFor();
    await input.setInputFiles([new URL('../public/illustrations/rooftop-demo.png',import.meta.url).pathname,new URL('../public/illustrations/culture-demo.png',import.meta.url).pathname]);
    await page.getByText('4/4 médias',{exact:false}).waitFor();assert.ok(await input.isDisabled());
    await page.getByRole('button',{name:'Publier',exact:true}).click();
    const post=page.getByRole('article').filter({hasText:'Mon album photo et vidéo.'});await post.waitFor();
    assert.equal(await post.locator('img[alt*="photo"]').count(),3);
    const video=post.locator('video');await video.waitFor();
    await video.evaluate(async element=>{const video=element as HTMLVideoElement;await video.play();video.pause();});
    assert.equal(await video.evaluate(element=>(element as HTMLVideoElement).videoWidth),160);
    await page.reload();await post.waitFor();await post.locator('video').waitFor();
    const state=await (await fetch(url+'/api/posts',{headers:{Authorization:`Bearer ${actor.token}`}})).json();const stored=state.posts.find((post:any)=>post.text==='Mon album photo et vidéo.');assert.equal(stored.media.length,4);assert.equal(stored.media.filter((item:any)=>item.type==='video').length,1);
  }finally{await browser.close();}
}
