import { openAccount } from './browser_ui';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

export async function checkDeepReview(url: string, password: string) {
  const browser = await chromium.launch({executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined});
  try {
    const login = await fetch(url+'/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:'redloop_admin',password})});
    assert.equal(login.status, 200);
    const admin = await login.json();
    const context = await browser.newContext({viewport:{width:320,height:568}});
    await context.addInitScript(({token,user}) => {
      localStorage.setItem('chkpt_session_token',token);
      localStorage.setItem('chkpt_abidjan_v1_user',JSON.stringify(user));
    },admin);
    const page = await context.newPage();
    let release!: () => void;
    const held = new Promise<void>(resolve => {release=resolve;});
    let initial = true;
    await page.route('**/api/auth/me', async route => {
      if (!initial) return route.continue();
      initial = false;
      const response = await route.fetch();
      await held;
      await route.fulfill({response}).catch(() => {}); // The old request should be aborted.
    });
    await page.goto(url);
    await openAccount(page);
    await page.getByRole('button',{name:'Profils Démo (opérateur)',exact:true}).click();
    const sarah = page.getByRole('button').filter({hasText:'Sarah Diallo'}).last();
    await page.evaluate(() => document.fonts.ready);
    await sarah.scrollIntoViewIfNeeded();
    const box = await sarah.boundingBox();
    assert.ok(box && box.y >= 0 && box.y+box.height <= 568, `Le bouton doit être accessible avant sélection : ${JSON.stringify(box)}`);
    await sarah.click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('chkpt_abidjan_v1_user')!).username === 'sarah_dlo');
    release();
    await page.waitForTimeout(150);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('chkpt_abidjan_v1_user')!).role),'user');
    await context.close();

    const start = await fetch(url+'/api/demo/start',{method:'POST',headers:{Authorization:`Bearer ${admin.token}`}});
    assert.equal(start.status,200);
    const koffi = await start.json();
    const gpsContext = await browser.newContext({viewport:{width:390,height:844}});
    await gpsContext.addInitScript(({token,user}) => {
      localStorage.setItem('chkpt_session_token',token);
      localStorage.setItem('chkpt_abidjan_v1_user',JSON.stringify(user));
    },koffi);
    const gps = await gpsContext.newPage();
    let releaseProfile!: () => void;
    let profileReady!: () => void;
    const profileHeld = new Promise<void>(resolve => {releaseProfile=resolve;});
    const ready = new Promise<void>(resolve => {profileReady=resolve;});
    await gps.route('**/api/auth/me', async route => {
      const response = await route.fetch();
      profileReady();
      await profileHeld;
      await route.fulfill({response});
    });
    await gps.goto(url);
    await ready;
    await gps.getByRole('tab',{name:'Amis',exact:true}).click();
    await gps.waitForFunction(() => !document.body.innerText.includes('@amara_sound'));
    assert.equal(await gps.getByText('@sarah_dlo',{exact:true}).count(),0);
    await gps.getByRole('tab',{name:'Pour toi',exact:true}).click();
    await gps.getByText('@amara_sound',{exact:true}).waitFor();
    await gps.getByRole('button',{name:'Valider ma présence physique',exact:true}).click();
    await gps.getByRole('dialog',{name:'Check-in',exact:true}).getByRole('button',{name:/Maquis L'Étoile/}).click();
    await gps.getByRole('button',{name:'Confirmer le check',exact:true}).click();
    await gps.getByRole('heading',{name:'Visite simulée enregistrée !'}).waitFor();
    releaseProfile();
    await gps.waitForTimeout(250);
    await gps.getByRole('button',{name:'Plus tard (Terminer)'}).click();
    await gps.getByRole('button',{name:'Profil',exact:true}).click();
    await gps.getByText(/1315 XP au total/).waitFor({timeout:3000});
    await gps.evaluate(() => { navigator.geolocation.getCurrentPosition = () => {}; });
    await gps.getByRole('button', { name: 'GPS', exact: true }).click();
    await gps.getByRole('region', { name: 'Réglages GPS', exact: true }).getByRole('button',{name:'GPS Réel',exact:true}).click();
    let submissions=0;
    gps.on('request',req=>{if(req.url().endsWith('/api/checkins') && req.method()==='POST') submissions++;});
    await gps.getByRole('button',{name:'Valider ma présence physique',exact:true}).click();
    await gps.getByRole('dialog',{name:'Check-in',exact:true}).getByRole('button',{name:/Maquis L'Étoile/}).click();
    await gps.getByRole('button',{name:'Confirmer le check',exact:true}).click();
    await gps.getByText(/Position GPS en cours de recherche/).waitFor();
    assert.equal(submissions,0,'Aucune coordonnée simulée ne doit être envoyée comme un GPS réel en attente');
    await gpsContext.close();
  } finally {await browser.close();}
}
