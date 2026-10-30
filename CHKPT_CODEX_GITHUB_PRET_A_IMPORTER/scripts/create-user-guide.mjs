import {execFileSync} from 'node:child_process';
import {mkdtemp,readFile,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const project=fileURLToPath(new URL('../',import.meta.url));const temp=await mkdtemp(path.join(tmpdir(),'chkpt-user-guide-'));let browser;
try{
 const html=path.join(temp,'guide.html');execFileSync(process.env.PYTHON||'python3',[path.join(project,'scripts/create-user-guide.py'),html],{stdio:'inherit'});
 browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});const context=await browser.newContext({offline:true});const page=await context.newPage();await page.setContent(await readFile(html,'utf8'));await page.waitForFunction(()=>[...document.images].every(image=>image.complete&&image.naturalWidth>0));await page.emulateMedia({media:'print'});
 const overflow=await page.locator('section').evaluateAll(sections=>sections.map((section,index)=>({page:index+1,bad:section.scrollHeight>section.clientHeight+1||section.querySelector('.copy').getBoundingClientRect().bottom>section.querySelector('footer').getBoundingClientRect().top})).filter(item=>item.bad));if(overflow.length)throw Error('Contenu dépassant : '+overflow.map(item=>item.page).join(', '));
 await page.pdf({path:path.join(project,'docs/GUIDE_UTILISATION_COMPLET.pdf'),printBackground:true,preferCSSPageSize:true});
 for(const format of ['pdf','pptx']){const file=path.join(project,'docs/GUIDE_UTILISATION_COMPLET.'+format);const size=(await stat(file)).size;if(size>=40*1024*1024)throw Error('Le guide dépasse 40 Mo');console.log(format.toUpperCase()+': '+(size/1024/1024).toFixed(2)+' Mo');}
 console.log('Guide complet : images intégrées, PDF contrôlé sans réseau et texte sans débordement.');
}finally{await browser?.close();await rm(temp,{recursive:true,force:true});}
