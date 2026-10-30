import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { toggleTheme } from './browser_ui';

export async function checkLargePlace(url: string) {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  try {
    for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 950 }, { width: 1280, height: 900 }]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      await context.route('https://**/*', route => route.abort());
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      const gps = page.getByRole('button', { name: 'GPS', exact: true });
      await gps.click();
      const menu = page.getByRole('region', { name: 'Réglages GPS', exact: true });
      await menu.getByRole('button', { name: 'Simulateur', exact: true }).waitFor();
      await menu.getByRole('button', { name: 'GPS Réel', exact: true }).waitFor();
      if (process.env.CHKPT_CAPTURE_DIR && viewport.width === 390) {
        await mkdir(process.env.CHKPT_CAPTURE_DIR, { recursive: true });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, 'gps-positions-390.png') });
      }
      await menu.getByRole('button', { name: /Cocody Saint-Jean/ }).click();
      assert.match(await gps.innerText(), /Cocody/);
      for (const theme of ['light', 'dark']) {
        if (theme === 'dark') await toggleTheme(page);
        await page.getByRole('article').filter({ hasText: 'Une belle découverte à Cocody' }).getByRole('button', { name: /Maquis L.Étoile/ }).click();
        const dialog = page.getByRole('region', { name: "Maquis L'Étoile d'Abidjan", exact: true });
        await dialog.waitFor();
        await page.evaluate(() => document.fonts.ready);
        const box = await dialog.boundingBox();
        assert.ok(box);
        if (viewport.width < 640) {
          assert.ok(box.width >= viewport.width - 1 && box.height >= viewport.height - 1, 'La fiche remplit le téléphone');
        } else {
          assert.ok(box.width >= 640 && box.height >= 800, 'La fiche est agrandie sur ordinateur');
        }
        assert.ok(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth), 'La fiche ne déborde pas horizontalement');
        assert.equal(await dialog.getByRole('button', { name: /check/i }).count(), 0, 'Le bouton central reste l’unique accès au check-in');
        await dialog.getByText('Lieu fictif de démonstration', { exact: true }).waitFor();
        if (process.env.CHKPT_CAPTURE_DIR) await page.screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, `fiche-large-${theme}-${viewport.width}.png`) });
        if (theme === 'light') {
          const save = dialog.getByRole('button', { name: /Enregistrer le lieu|Retirer des favoris/ });
          const previous = await save.getAttribute('aria-pressed');
          await save.click();
          assert.notEqual(await save.getAttribute('aria-pressed'), previous);
        }
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        const close = await dialog.getByRole('button', { name: 'Retour', exact: true }).boundingBox();
        assert.ok(close && close.y >= 0 && close.y + close.height <= viewport.height, 'Le retour reste accessible après défilement');
        await page.keyboard.press('Escape');
        await dialog.waitFor({state:'hidden'});
      }
      if (viewport.width === 390) {
        await page.getByRole('article').filter({ hasText: '@ingrid_ngoan' }).first().getByRole('button', { name: /Lagon Bleu Rooftop/ }).click();
        const gallery = page.getByRole('region', { name: 'Lagon Bleu Rooftop Lounge', exact: true });
        await gallery.getByRole('button', { name: 'Voir l’illustration 2', exact: true }).click();
        assert.equal(await gallery.getByRole('img', { name: /Illustration :/ }).getAttribute('src'), '/illustrations/cafe.svg');
        await gallery.getByRole('button', { name: 'Retour', exact: true }).click();
      }
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`  Fiche ${viewport.width}px : GPS avec commune, positions au choix, grand format, favoris, retour et deux thèmes OK`);
    }
  } finally { await browser.close(); }
}
