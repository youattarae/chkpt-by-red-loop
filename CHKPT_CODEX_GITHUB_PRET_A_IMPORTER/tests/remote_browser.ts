import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import https from 'node:https';
import http from 'node:http';
import { once } from 'node:events';
import { execFileSync } from 'node:child_process';
import { readFile, mkdtemp, rm, mkdir } from 'node:fs/promises';
import path from 'node:path';
export async function checkRemoteBrowser(upstream: string, password: string) {
  const temp = await mkdtemp('/tmp/chkpt-tls-');
  // A temporary self-signed test proxy; deployed HTTPS remains the host's responsibility.
  execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',path.join(temp,'key.pem'),'-out',path.join(temp,'cert.pem'),'-subj','/CN=localhost','-days','1'],{stdio:'ignore'});
  const proxy = https.createServer({key:await readFile(path.join(temp,'key.pem')),cert:await readFile(path.join(temp,'cert.pem'))},(req,res)=>{
    const outgoing=http.request(new URL(req.url!,upstream),{method:req.method,headers:{...req.headers,'x-forwarded-proto':'https'}},incoming=>{res.writeHead(incoming.statusCode!,incoming.headers);incoming.pipe(res);});
    outgoing.on('error',()=>{res.writeHead(502);res.end();});req.pipe(outgoing);
  });
  proxy.listen(0,'127.0.0.1');await once(proxy,'listening');
  const address=proxy.address() as {port:number};const url=`https://127.0.0.1:${address.port}`;
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});
  try {
    const context=await browser.newContext({viewport:{width:390,height:950},ignoreHTTPSErrors:true,reducedMotion:'reduce'});
    const page=await context.newPage();
    await page.goto(url+'/#lieu=plc_maquis_etoile');
    await page.getByRole('heading',{name:'Bienvenue sur CHKPT',exact:true}).waitFor();
    if(process.env.CHKPT_CAPTURE_DIR){await mkdir(process.env.CHKPT_CAPTURE_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,'acces-prive-390.png')});}
    await page.getByLabel('Mot de passe d’accès',{exact:true}).fill(password);
    await page.getByRole('button',{name:'Ouvrir la démonstration',exact:true}).click();
    const venue=page.getByRole('dialog',{name:"Maquis L'Étoile d'Abidjan",exact:true});
    await venue.waitFor();
    await venue.getByRole('button',{name:'Fermer la fiche',exact:true}).click();
    assert.equal((await context.request.get(url+'/api/places')).status(),200);
    await page.getByRole('button',{name:'Profil',exact:true}).click();
    await page.getByRole('button',{name:'Réglages',exact:true}).click();
    await page.getByRole('button',{name:'Fermer l’accès privé à distance',exact:true}).click();
    await page.getByRole('heading',{name:'Bienvenue sur CHKPT',exact:true}).waitFor();
    assert.equal((await context.request.get(url+'/api/places')).status(),401);
    await context.close();
  } finally {await browser.close();await new Promise<void>(resolve=>proxy.close(()=>resolve()));await rm(temp,{recursive:true,force:true});}
}
