import { openAccount } from './browser_ui';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { chromium } from 'playwright';

export async function checkBrowser(url: string) {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
      const response = await fetch(url + '/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: `browser_${randomBytes(6).toString('hex')}`, password: randomBytes(24).toString('hex'), age: 22 }),
      });
      assert.equal(response.status, 201);
      const { token } = await response.json();
      const context = await browser.newContext({ viewport });
      // External photos are irrelevant to this deterministic interaction test.
      await context.route('https://**/*', route => route.abort());
      await context.addInitScript(token => localStorage.setItem('chkpt_session_token', token), token);
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.getByRole('button', { name: 'Carte', exact: true }).click();
      await page.getByRole('button', { name: "Choisir Maquis L'Étoile d'Abidjan", exact: true }).click();
      await page.getByRole('button', { name: 'Détails', exact: true }).click();
      await page.getByRole('button', { name: 'Faire un check-in ici' }).click();
      const dialog = page.getByRole('dialog', { name: 'Check-in', exact: true });
      assert.match(await dialog.getByRole('button', { pressed: true }).innerText(), /Maquis L'Étoile/);
      const sent = page.waitForRequest(request => request.url().endsWith('/api/checkins') && request.method() === 'POST');
      await dialog.getByRole('button', { name: 'Confirmer le check' }).click();
      const payload = (await sent).postDataJSON();
      assert.equal(payload.placeId, 'plc_maquis_etoile');
      assert.equal(payload.isSimulated, true);
      await dialog.getByRole('heading', { name: 'Visite simulée enregistrée !' }).waitFor();
      await dialog.getByRole('button', { name: 'Plus tard (Terminer)' }).click();
      // This used to keep the previous result/selection when reopening the persistent modal.
      await page.getByRole('button', { name: "Choisir L'Atelier Café & Bakery", exact: true }).click();
      await page.getByRole('button', { name: 'Détails', exact: true }).click();
      await page.getByRole('button', { name: 'Faire un check-in ici' }).click();
      assert.match(await dialog.getByRole('button', { pressed: true }).innerText(), /Atelier Café/);
      const second = page.waitForRequest(request => request.url().endsWith('/api/checkins') && request.method() === 'POST');
      await dialog.getByRole('button', { name: 'Confirmer le check' }).click();
      assert.equal((await second).postDataJSON().placeId, 'plc_cafe_atelier');
      await dialog.getByRole('heading', { name: 'Présence non confirmée' }).waitFor();
      await dialog.getByRole('button', { name: 'Fermer le check-in' }).click();
      await page.getByRole('button', { name: 'Valider ma présence physique', exact: true }).click();
      await dialog.getByRole('button', { name: 'Confirmer le check' }).waitFor();
      assert.equal(await dialog.getByRole('heading', { name: 'Présence non confirmée' }).count(), 0);
      await dialog.getByRole('button', { name: 'Fermer le check-in' }).click();
      await openAccount(page);
      await page.getByRole('button', { name: 'Profils Démo (opérateur)', exact: true }).click();
      await page.getByRole('button', { name: 'Réinitialiser le scénario Pitch (Démo vierge)' }).click();
      await page.getByText(/Erreur lors de la réinitialisation/).waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem('chkpt_session_token')), token);
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`  Navigateur ${viewport.width}px : bon lieu envoyé, simulation, refus hors rayon et réouverture OK`);
    }
  } finally {
    await browser.close();
  }
}
