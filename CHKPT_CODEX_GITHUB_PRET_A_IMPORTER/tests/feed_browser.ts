import { toggleTheme } from './browser_ui';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { INITIAL_POSTS } from '../src/data/mockData';

export async function checkFeed(url: string, password: string) {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  try {
    for (const width of [390, 1280]) {
      const login = await fetch(url + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'redloop_admin', password }) });
      assert.equal(login.status, 200);
      const admin = await login.json();
      const start = await fetch(url + '/api/demo/start', { method: 'POST', headers: { Authorization: `Bearer ${admin.token}` } });
      assert.equal(start.status, 200);
      const persona = await start.json();
      const context = await browser.newContext({ viewport: { width, height: 950 }, reducedMotion: 'reduce' });
      await context.route('https://**/*', route => route.abort());
      // Use old cached seed image URLs, as on a Mac that already ran the previous version.
      const legacy = INITIAL_POSTS.map(post => ({ ...post, mediaUrl: post.id === 'pst_01' ? '/illustrations/rooftop.svg' : post.id === 'pst_02' ? '/illustrations/art.svg' : post.mediaUrl }));
      await context.addInitScript(({ token, user, posts }) => {
        localStorage.setItem('chkpt_session_token', token);
        localStorage.setItem('chkpt_abidjan_v1_user', JSON.stringify(user));
        localStorage.setItem('chkpt_abidjan_v1_posts', JSON.stringify(posts));
      }, { ...persona, posts: legacy });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      const tabs = page.getByRole('tablist', { name: 'Fil d’actualité', exact: true });
      assert.deepEqual(await tabs.getByRole('tab').allTextContents(), ['Pour toi', 'Amis']);
      await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
      assert.equal(await page.locator('article img[src="/illustrations/rooftop-demo.png"]:not([alt=""])').count(), INITIAL_POSTS.filter(post=>post.mediaUrl==='/illustrations/rooftop-demo.png').length);
      assert.equal(await page.locator('article img[src="/illustrations/culture-demo.png"]:not([alt=""])').count(), INITIAL_POSTS.filter(post=>post.mediaUrl==='/illustrations/culture-demo.png').length);
      assert.equal(await page.getByText(/image générée par IA/).count(), INITIAL_POSTS.length);
      const album=page.getByRole('article').filter({hasText:'Une belle découverte à Cocody'});
      assert.equal(await album.locator('img[alt*="photo"]').count(),4);
      assert.equal(new Set(await album.locator('img[alt*="photo"]').evaluateAll(images=>images.map(image=>(image as HTMLImageElement).src))).size,4);
      const bankAd = page.getByRole('region', { name: 'Publicité fictive de banque', exact: true });
      await bankAd.getByText('Banque Boucle', { exact: true }).waitFor();
      assert.equal(await bankAd.locator('a, button, [role="button"], [onclick], [tabindex]').count(), 0, 'Publicité sans lien ni contrôle interactif');
      assert.equal(await bankAd.locator('img[src="/illustrations/banque-demo.png"]').count(), 1);
      const beforeAdClick = page.url();
      await bankAd.click();
      assert.equal(page.url(), beforeAdClick, 'Un clic sur la publicité ne navigue pas');

      for (const theme of ['light', 'dark']) {
        if (theme === 'dark') await toggleTheme(page);
        await page.evaluate(() => document.fonts.ready);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Accueil ${width}px / ${theme} sans débordement`);
        if (process.env.CHKPT_CAPTURE_DIR) {
          await mkdir(process.env.CHKPT_CAPTURE_DIR, { recursive: true });
          await page.screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, `accueil-social-${theme}-${width}.png`) });
          if (width === 390 && theme === 'light') {
            await album.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,'publication-album-4-images-390.png'),style:'nav, header[aria-label="En-tête CHKPT"] { visibility: hidden !important; }'});
            await bankAd.screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, 'publicite-banque-390.png') });
            const detailStyle = 'nav, header[aria-label="En-tête CHKPT"] { visibility: hidden !important; }';
            await page.getByRole('article').filter({ hasText: '@ingrid_ngoan' }).first().screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, 'publication-rooftop.png'), style: detailStyle });
            await page.getByRole('article').filter({ hasText: '@georges_armand' }).first().screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, 'publication-culture.png'), style: detailStyle });
            await page.evaluate(() => scrollTo(0, 0));
          }
        }
      }
      await tabs.getByRole('tab', { name: 'Pour toi', exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await tabs.getByRole('tab', { name: 'Amis', exact: true }).getAttribute('aria-selected'), 'true');
      // Koffi has no outgoing follow in the canonical seed; never invent friends.
      assert.equal(await page.getByText('@ingrid_ngoan', { exact: true }).count(), 0);
      assert.equal(await page.getByText('@georges_armand', { exact: true }).count(), 0);
      await page.keyboard.press('Home');
      await page.getByText('@georges_armand', { exact: true }).first().waitFor();
      await page.getByRole('button', { name: 'Filtrer les publications', exact: true }).click();
      await page.locator('#feed-filters').getByRole('button', { name: /^Maquis/ }).click();
      assert.equal(await page.getByRole('article').count(), 5);
      await page.locator('#feed-filters').getByTitle('Afficher toutes les catégories', { exact: true }).click();
      assert.equal(await page.getByRole('article').count(), INITIAL_POSTS.length);
      await page.getByRole('button', { name: 'Filtrer les publications', exact: true }).click();
      await page.getByRole('button', { name: /Qu’as-tu découvert/ }).click();
      const message = `Une découverte à partager — accueil ${width}`;
      await page.getByPlaceholder('Partage tes bonnes adresses, tes coups de cœur…', { exact: true }).fill(message);
      await page.getByRole('button', { name: 'Publier', exact: true }).click();
      await page.getByRole('tabpanel',{name:'Pour toi',exact:true}).getByText(message, { exact: true }).waitFor();
      const post = page.getByRole('article').filter({ hasText: message });
      await post.getByRole('button', { name: 'Aimer cette publication', exact: true }).click();
      await page.getByRole('button', { name: 'Profil', exact: true }).click();
      const mine = page.getByRole('region', { name: 'Mes publications', exact: true }).getByRole('article').filter({ hasText: message });
      assert.equal(await mine.getByRole('button', { name: 'Aimer cette publication', exact: true }).getAttribute('aria-pressed'), 'true');
      await page.getByText(/1240 XP au total/).waitFor();
      await page.getByRole('button', { name: 'Accueil', exact: true }).click();
      assert.equal(await page.getByRole('article').getByRole('button', { name: /Faire un check/ }).count(), 0);
      await page.getByRole('button', { name: 'Valider ma présence physique', exact: true }).click();
      const dialog = page.getByRole('dialog', { name: 'Check-in', exact: true });
      await dialog.getByText('Simulation GPS · données fictives', { exact: true }).waitFor();
      assert.equal(await dialog.getByRole('button', { name: 'Confirmer le check', exact: true }).count(), 1);
      assert.equal(await dialog.getByRole('button', { name: /Simuler ma visite/ }).count(), 0);
      assert.equal(await dialog.getByRole('button', { name: 'Confirmer le check', exact: true }).isDisabled(), true);
      await dialog.getByRole('button', { name: /Maquis L'Étoile/ }).click();
      assert.match(await dialog.getByRole('button', { pressed: true }).innerText(), /Maquis L'Étoile/);
      const sent = page.waitForRequest(request => request.url().endsWith('/api/checkins') && request.method() === 'POST');
      await dialog.getByRole('button', { name: 'Confirmer le check', exact: true }).click();
      assert.equal((await sent).postDataJSON().placeId, 'plc_maquis_etoile');
      await dialog.getByRole('heading', { name: 'Visite simulée enregistrée !', exact: true }).waitFor();
      assert.deepEqual(errors, []);
      await context.close();
      // Sarah genuinely follows Koffi in the seed: exercise the positive path too.
      const operator = await fetch(url + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'redloop_admin', password }) });
      assert.equal(operator.status, 200);
      const operatorSession = await operator.json();
      const switched = await fetch(url + '/api/auth/switch-demo', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${operatorSession.token}` }, body: JSON.stringify({ username: 'ingrid_ngoan' }) });
      assert.equal(switched.status, 200);
      const sarah = await switched.json();
      const friendContext = await browser.newContext({ viewport: { width, height: 950 } });
      await friendContext.route('https://**/*', route => route.abort());
      await friendContext.addInitScript(({ token, user, posts }) => {
        localStorage.setItem('chkpt_session_token', token);
        localStorage.setItem('chkpt_abidjan_v1_user', JSON.stringify(user));
        localStorage.setItem('chkpt_abidjan_v1_posts', JSON.stringify(posts));
      }, { ...sarah, posts: legacy });
      const friends = await friendContext.newPage();
      await friends.goto(url);
      await friends.getByRole('tab', { name: 'Amis', exact: true }).click();
      await friends.getByText('@yacoub_ouattara', { exact: true }).first().waitFor();
      assert.equal(await friends.getByText('@georges_armand', { exact: true }).count(), 0);
      assert.equal(await friends.getByText('@ingrid_ngoan', { exact: true }).count(), 0);
      await friendContext.close();
      console.log(`  Accueil ${width}px : deux onglets, filtres, nouveaux visuels sur cache ancien, publication et réaction partagée ; Confirmer le check explicite`);
    }
  } finally { await browser.close(); }
}
