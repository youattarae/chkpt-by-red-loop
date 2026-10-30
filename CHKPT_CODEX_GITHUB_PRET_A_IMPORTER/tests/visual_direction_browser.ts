import { toggleTheme } from './browser_ui';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

export async function checkVisualDirection(url: string) {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  try {
    for (const width of [320, 390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', colorScheme: 'dark' });
      await context.route('https://**/*', route => route.abort());
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light', 'Le premier lancement reste clair même si le système est sombre');
      assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 255, 255)');
      assert.equal(await page.getByText('by RED LOOP', { exact: true }).count(), 0);
      const header = page.getByRole('banner', { name: 'En-tête CHKPT', exact: true });
      assert.equal(await header.getByText('CHKPT', { exact: true }).count(), 0);
      assert.equal(await header.locator('select').count(), 0);
      assert.equal(await page.getByRole('button', { name: 'Mode sombre', exact: true }).count(), 0, 'Le thème est uniquement dans les réglages');
      assert.equal(await header.getByRole('button', { name: 'GPS', exact: true }).count(), 1);
      assert.equal(await header.getByRole('button').count(), 4, 'Symbole, GPS, notifications et menu personnel');
      const gps = header.getByRole('button', { name: 'GPS', exact: true });
      await gps.click();
      const spots = header.getByRole('region', { name: 'Positions de démonstration', exact: true });
      assert.equal(await spots.getByRole('button').count(), 6);
      await spots.getByRole('button', { name: /Marcory Zone 4/ }).click();
      assert.equal(await gps.getAttribute('aria-expanded'), 'false');
      assert.match(await gps.innerText(), /Marcory/);
      await gps.click();
      assert.equal(await spots.getByRole('button', { name: /Marcory Zone 4/ }).getAttribute('aria-pressed'), 'true');
      await spots.getByRole('button', { name: /Cocody Saint-Jean/ }).click();
      assert.match(await gps.innerText(), /Cocody/);
      const checkin = page.getByRole('button', { name: 'Valider ma présence physique', exact: true });
      assert.equal(await checkin.locator('img[src="/brand/chkpt-symbol.svg"]').count(), 1);
      assert.equal(await checkin.locator('svg').count(), 0, 'Le symbole remplace la cible dans le bouton central');
      for (const theme of ['light', 'dark']) {
        if (theme === 'dark') await toggleTheme(page);
        await page.reload();
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme, 'Le choix reste après rechargement');
        await page.evaluate(() => document.fonts.ready);
        const colors = await page.evaluate(() => ['--canvas', '--ink', '--body', '--muted', '--tone-blue-400', '--tone-blue-600']
          .map(token => getComputedStyle(document.documentElement).getPropertyValue(token)));
        const luminance = (hex: string) => {
          let digits = hex.trim().replace('#', '');
          if (digits.length === 3) digits = digits.split('').map(value => value + value).join('');
          const values = digits.match(/../g)!.map(value => parseInt(value, 16) / 255)
            .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
          return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
        };
        for (const [foreground, background] of [...colors.slice(1, 5).map(color => [color, colors[0]]), [colors[5], '#ffffff']]) {
          const a = luminance(foreground), b = luminance(background);
          const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
          assert.ok(ratio >= 4.5, `Contraste des textes ${foreground} / ${background} / ${theme} : ${ratio.toFixed(2)}`);
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Aucun débordement ${width}px / ${theme}`);
        for (const button of await page.locator('header button').all()) {
          if (!await button.isVisible()) continue;
          const box = await button.boundingBox();
          assert.ok(box && box.x >= 0 && box.x + box.width <= width + 1, `En-tête accessible : ${await button.getAttribute('title')} ${width}px / ${theme}`);
        }
        for (const tab of ['Carte', 'Sortir', 'Profil', 'Accueil']) {
          await page.getByRole('button', { name: tab, exact: true }).click();
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${tab} sans débordement ${width}px / ${theme}`);
        }
        await checkin.click();
        await page.getByRole('dialog', { name: 'Check-in', exact: true }).waitFor();
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
        await page.getByRole('button', { name: 'Fermer' }).click();
        await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
        if (process.env.CHKPT_CAPTURE_DIR) {
          await mkdir(process.env.CHKPT_CAPTURE_DIR, { recursive: true });
          await page.screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, `accueil-${theme}-${width}.png`) });
        }
      }
      assert.equal(await toggleTheme(page), 'false');
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`  Direction visuelle ${width}px : clair par défaut, sombre mémorisé, symbole, navigation et images locales OK`);
    }
  } finally { await browser.close(); }
}
