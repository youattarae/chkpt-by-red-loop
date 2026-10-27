import { openAccount, toggleTheme } from './browser_ui';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

export async function checkPresentation(url: string, password: string) {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  try {
    for (const width of [390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.route('https://**/*', route => route.abort());
      await context.route('**/illustrations/rooftop.svg', route => route.abort());
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      // Exercise the entire scenario in light on mobile and dark on desktop.
      const theme = width === 1280 ? 'dark' : 'light';
      if (theme === 'dark') await toggleTheme(page);
      async function capture(name: string) {
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => [...document.images].every(image => image.complete));
        const broken = await page.locator('img').evaluateAll(images => images.filter(image => image instanceof HTMLImageElement && (!image.complete || image.naturalWidth === 0)).length);
        assert.equal(broken, 0, 'Toutes les illustrations doivent charger sans réseau externe');
        if (process.env.CHKPT_CAPTURE_DIR) {
          await mkdir(process.env.CHKPT_CAPTURE_DIR, { recursive: true });
          await page.screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, `${name}-${width}.png`) });
        }
      }
      await capture('accueil');
      async function start() {
        await openAccount(page);
        await page.getByRole('button', { name: 'Connexion', exact: true }).click();
        await page.getByPlaceholder('ex: koffi_urbex').fill('redloop_admin');
        await page.locator('input[type=password]').fill(password);
        await page.getByRole('button', { name: /Se connecter/ }).click();
        await page.waitForTimeout(1200);
        await openAccount(page);
        await page.getByRole('button', { name: 'Profils Démo (opérateur)', exact: true }).click();
        await page.getByRole('button', { name: 'Démarrer la démo', exact: true }).click();
        await page.getByRole('button', { name: 'Carte', exact: true }).waitFor();
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme, 'La remise à zéro du scénario conserve le thème');
      }
      async function visit() {
        await page.getByRole('button', { name: 'Carte', exact: true }).click();
        await page.getByRole('button', { name: "Choisir Maquis L'Étoile d'Abidjan", exact: true }).click();
        await capture('carte');
        await page.getByRole('button', { name: 'Détails', exact: true }).click();
        await capture('fiche');
        await page.getByRole('button', { name: 'Faire un check-in ici' }).click();
        await capture('check-confirm');
        await page.getByRole('button', { name: 'Confirmer le check' }).click();
        await page.getByRole('heading', { name: 'Visite simulée enregistrée !' }).waitFor();
        await page.getByText('Nouveau Badge débloqué : Initié du Braisé !').waitFor();
      }
      await start();
      await visit();
      await capture('checkin');
      await page.getByRole('button', { name: 'Créer une publication' }).click();
      const message = `Une soirée à Cocody — recette ${width}`;
      await page.getByPlaceholder("Racontez votre expérience, l'ambiance, les plats...").fill(message);
      await capture('publication');
      await page.getByRole('button', { name: 'Publier le checkpoint' }).click();
      await page.getByText(message, { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Profil', exact: true }).click();
      await page.getByRole('region', { name: 'Mes publications' }).getByText(message, { exact: true }).waitFor();
      await page.getByText(/1315 XP au total/).waitFor();
      await capture('profil');
      await page.getByRole('button', { name: 'Sortir', exact: true }).click();
      const going = page.getByRole('button', { name: "J'y serai", exact: true }).first();
      assert.equal(await going.getAttribute('aria-pressed'), 'false');
      await going.click();
      assert.equal(await going.getAttribute('aria-pressed'), 'true');
      await capture('sortir');
      assert.ok(await page.locator('img[data-fallback=true]').count() > 0, 'Une image indisponible doit avoir un secours local');
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
