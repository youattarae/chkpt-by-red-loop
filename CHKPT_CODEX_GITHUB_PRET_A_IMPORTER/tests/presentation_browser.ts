import assert from 'node:assert/strict';
import { chromium } from 'playwright';

export async function checkPresentation(url: string, password: string) {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  try {
    for (const width of [390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.route('https://**/*', route => route.abort());
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      async function start() {
        await page.getByTitle('Profil & Compte Démo').click();
        await page.getByRole('button', { name: 'Connexion', exact: true }).click();
        await page.getByPlaceholder('ex: koffi_urbex').fill('redloop_admin');
        await page.locator('input[type=password]').fill(password);
        await page.getByRole('button', { name: /Se connecter/ }).click();
        await page.waitForTimeout(1200);
        await page.getByTitle('Profil & Compte Démo').click();
        await page.getByRole('button', { name: 'Profils Démo (opérateur)', exact: true }).click();
        await page.getByRole('button', { name: 'Démarrer la démo', exact: true }).click();
        await page.getByRole('button', { name: 'Carte', exact: true }).waitFor();
      }
      async function visit() {
        await page.getByRole('button', { name: 'Carte', exact: true }).click();
        await page.getByRole('button', { name: "Choisir Maquis L'Étoile d'Abidjan", exact: true }).click();
        await page.getByRole('button', { name: 'Détails', exact: true }).click();
        await page.getByRole('button', { name: 'Faire un check-in ici' }).click();
        await page.getByRole('button', { name: 'Confirmer ma présence physique' }).click();
        await page.getByRole('heading', { name: 'Visite simulée enregistrée !' }).waitFor();
        await page.getByText('Nouveau Badge débloqué : Initié du Braisé !').waitFor();
      }
      await start();
      await visit();
      await page.getByRole('button', { name: 'Créer une publication' }).click();
      const message = `Une soirée à Cocody — recette ${width}`;
      await page.getByPlaceholder("Racontez votre expérience, l'ambiance, les plats...").fill(message);
      await page.getByRole('button', { name: 'Publier le checkpoint' }).click();
      await page.getByText(message, { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Profil', exact: true }).click();
      await page.getByRole('region', { name: 'Mes publications' }).getByText(message, { exact: true }).waitFor();
      await page.getByText(/1315 XP au total/).waitFor();
      await page.getByRole('button', { name: 'Sortir', exact: true }).click();
      const going = page.getByRole('button', { name: "J'y serai", exact: true }).first();
      assert.equal(await going.getAttribute('aria-pressed'), 'false');
      await going.click();
      assert.equal(await going.getAttribute('aria-pressed'), 'true');
      await page.reload();
      await page.getByRole('button', { name: 'Sortir', exact: true }).click();
      assert.equal(await page.getByRole('button', { name: "J'y serai", exact: true }).first().getAttribute('aria-pressed'), 'true');
      await page.getByRole('button', { name: 'Profil', exact: true }).click();
      await page.getByRole('region', { name: 'Mes publications' }).getByText(message, { exact: true }).waitFor();
      await page.getByText(/1315 XP au total/).waitFor();
      // Start again through the operator, proving reset and the daily XP key are reusable.
      await start();
      await visit();
      assert.equal(await page.getByText(message, { exact: true }).count(), 0);
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`  Présentation ${width}px : connexion opérateur, badge, publication, XP, événement, rechargement et répétition OK`);
    }
  } finally { await browser.close(); }
}
