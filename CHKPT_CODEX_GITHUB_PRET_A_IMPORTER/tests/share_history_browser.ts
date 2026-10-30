import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { toggleTheme } from './browser_ui';

export async function checkShareHistory(url: string, password: string) {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  try {
    const login = await fetch(url + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'redloop_admin', password }) });
    const admin = await login.json();
    const reset = await fetch(url + '/api/demo/start', { method: 'POST', headers: { Authorization: `Bearer ${admin.token}` } });
    const persona = await reset.json();
    const places=await (await fetch(url+'/api/places')).json();
    const roof=places.places.find((place:any)=>place.id==='plc_cocody_lounge');
    const visitResponse=await fetch(url+'/api/checkins',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${persona.token}`},body:JSON.stringify({placeId:roof.id,latitude:roof.coordinates.lat,longitude:roof.coordinates.lng,isSimulated:true,audience:'private'})});
    assert.equal(visitResponse.status,201);

    for (const width of [320, 390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 950 }, reducedMotion: 'reduce' });
      await context.addInitScript(({ token, user }) => {
        // Seed deliberately mixed ownership and rejected attempts to check history filtering.
        const visit = { id: 'visit-new', userId: user.id, placeId: 'plc_maquis_etoile', placeName: "Maquis L'Étoile d'Abidjan", timestamp: '2026-10-28T12:00:00Z', status: 'verified', isSimulated: true, audience: 'private' };
        localStorage.setItem('chkpt_session_token', token);
        localStorage.setItem('chkpt_abidjan_v1_user', JSON.stringify(user));
        localStorage.setItem('chkpt_abidjan_v1_checkins', JSON.stringify([
          { ...visit, id: 'old', timestamp: '2026-10-25T12:00:00Z' },
          { ...visit, id: 'other', userId: 'someone-else', placeId: 'private-other', placeName: 'Historique autre personne' },
          { ...visit, id: 'refused', status: 'rejected', placeId: 'refused', placeName: 'Tentative refusée' }, visit,
        ]));
        Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      }, persona);
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.getByRole('button', { name: 'Profil', exact: true }).click();
      await page.getByRole('button',{name:'Ouvrir mon menu'}).click();await page.getByRole('dialog',{name:'Mon menu'}).getByRole('button',{name:'Historique privé'}).click();
      const history = page.getByRole('region', { name: 'Historique des lieux visités', exact: true });
      await history.getByText(/2 visites/).waitFor();
      assert.equal(await history.getByRole('button').count(), 1, 'Deux visites du même lieu donnent une fiche');
      await history.getByText(/2 visites/).waitFor();
      assert.equal(await history.getByText(/Historique autre personne|Tentative refusée/).count(), 0);
      assert.equal(await history.getByText(/Maquis L'Étoile/).count(),0,'Les visites forgées dans le cache local ne sont pas synchronisées');
      for (const theme of ['light', 'dark']) {
        if (theme === 'dark') {await toggleTheme(page);await page.getByRole('button',{name:'Ouvrir mon menu'}).click();await page.getByRole('dialog',{name:'Mon menu'}).getByRole('button',{name:'Historique privé'}).click();}
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (width === 390 && process.env.CHKPT_CAPTURE_DIR) {
          await mkdir(process.env.CHKPT_CAPTURE_DIR, { recursive: true });
          await history.screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, `historique-lieux-${theme}-390.png`) });
        }
      }
      await history.getByRole('button').click();
      const venue = page.getByRole('region', { name: 'Lagon Bleu Rooftop Lounge', exact: true });
      await venue.getByRole('button', { name: 'Partager cet établissement', exact: true }).click();
      const share = venue.getByRole('region', { name: 'Partager le lieu', exact: true });
      const link = await share.getByRole('textbox', { name: 'Lien de la fiche', exact: true }).inputValue();
      assert.equal(link, url + '/#lieu=plc_cocody_lounge');
      assert.ok(!link.includes(persona.token));
      await page.evaluate("Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copied = text; } } })");
      await share.getByRole('button', { name: 'Copier le lien', exact: true }).click();
      await share.getByRole('status').getByText('Lien copié.', { exact: true }).waitFor();
      assert.equal(await page.evaluate(() => (window as any).__copied), link);
      assert.match(await share.getByRole('link', { name: 'WhatsApp', exact: true }).getAttribute('href') || '', /^https:\/\/wa.me\/\?text=/);
      if (width === 390 && process.env.CHKPT_CAPTURE_DIR) await page.screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, 'partage-lieu-390.png') });
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
      await share.getByRole('button', { name: 'Copier le lien', exact: true }).click();
      await share.getByText(/Sélectionnez puis copiez/).waitFor();
      await share.getByRole('button', { name: 'Fermer le partage', exact: true }).click();
      await page.evaluate("Object.defineProperty(navigator, 'share', { configurable: true, value: async data => { window.__shared = data; } })");
      await venue.getByRole('button', { name: 'Partager cet établissement', exact: true }).click();
      assert.equal(await page.evaluate(() => (window as any).__shared.url), link);
      assert.equal(await share.count(), 0);
      await page.evaluate("Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('cancel', 'AbortError'); } })");
      await venue.getByRole('button', { name: 'Partager cet établissement', exact: true }).click();
      assert.equal(await share.count(), 0, 'Annuler le menu natif ne montre pas une erreur');
      await page.goto(link);
      await page.reload();
      await venue.waitFor();
      assert.equal(await page.getByRole('dialog', { name: 'Check-in', exact: true }).count(), 0);
      await venue.getByRole('button', { name: 'Retour', exact: true }).click();
      assert.ok(!new URL(page.url()).hash.includes('lieu='));
      await page.goto(url + '/#lieu=unknown');
      await page.reload();
      assert.equal(await page.getByRole('dialog').count(), 0);
      await page.getByRole('button', { name: 'Profil', exact: true }).click();
      await page.getByRole('button',{name:'Ouvrir mon menu'}).click();await page.getByRole('dialog',{name:'Mon menu'}).getByRole('button',{name:'Historique privé'}).click();
      await history.getByText(/2 visites/).waitFor();
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
}
