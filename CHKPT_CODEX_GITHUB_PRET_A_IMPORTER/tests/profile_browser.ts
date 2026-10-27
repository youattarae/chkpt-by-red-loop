import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

export async function checkProfile(url: string, password: string) {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  try {
    for (const width of [320, 390, 1280]) {
      const login = await fetch(url + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'redloop_admin', password }) });
      assert.equal(login.status, 200);
      const admin = await login.json();
      const response = await fetch(url + '/api/demo/start', { method: 'POST', headers: { Authorization: `Bearer ${admin.token}` } });
      assert.equal(response.status, 200);
      const persona = await response.json();
      const context = await browser.newContext({ viewport: { width, height: 950 }, reducedMotion: 'reduce' });
      await context.route('https://**/*', route => route.abort());
      await context.addInitScript(({ token, user }) => {
        localStorage.setItem('chkpt_session_token', token);
        localStorage.setItem('chkpt_abidjan_v1_user', JSON.stringify(user));
      }, persona);
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.getByRole('button', { name: 'Profil', exact: true }).click();
      const publications = page.getByRole('region', { name: 'Mes publications', exact: true });
      const firstPost = publications.getByRole('article').first();
      await firstPost.waitFor();
      const text = await firstPost.locator('p').filter({ hasText: 'Une belle découverte' }).innerText();
      await page.getByText(/1240 XP au total/).waitFor();
      for (const theme of ['light', 'dark']) {
        if (theme === 'dark') await page.getByRole('button', { name: 'Mode sombre', exact: true }).click();
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
        for (const tab of ['Lieux enregistrés', 'Badges', 'Publications']) {
          await page.getByRole('tab', { name: tab, exact: true }).click();
          assert.equal(await page.getByRole('tab', { name: tab, exact: true }).getAttribute('aria-selected'), 'true');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Profil / ${tab} sans débordement ${width}px / ${theme}`);
        }
        if (process.env.CHKPT_CAPTURE_DIR) {
          await mkdir(process.env.CHKPT_CAPTURE_DIR, { recursive: true });
          await page.screenshot({ path: path.join(process.env.CHKPT_CAPTURE_DIR, `profil-social-${theme}-${width}.png`) });
        }
      }
      const like = firstPost.getByRole('button', { name: 'Aimer cette publication', exact: true });
      assert.equal(await like.getAttribute('aria-pressed'), 'false');
      await like.click();
      assert.equal(await like.getAttribute('aria-pressed'), 'true');
      await firstPost.getByRole('button', { name: 'Commentaires de cette publication', exact: true }).click();
      await firstPost.getByRole('textbox', { name: 'Ton commentaire', exact: true }).fill('Une adresse à garder pour la prochaine sortie.');
      await firstPost.getByRole('button', { name: 'Envoyer', exact: true }).click();
      await firstPost.getByText('Une adresse à garder pour la prochaine sortie.', { exact: true }).waitFor();
      const save = firstPost.getByRole('button', { name: 'Enregistrer le lieu de cette publication', exact: true });
      assert.equal(await save.getAttribute('aria-pressed'), 'false');
      await save.click();
      await page.getByRole('tab', { name: 'Lieux enregistrés', exact: true }).click();
      await page.getByRole('region', { name: 'Mes lieux enregistrés', exact: true }).getByRole('button', { name: /Maquis L.Étoile/ }).waitFor();
      await page.getByRole('tab', { name: 'Publications', exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.getByRole('tab', { name: 'Lieux enregistrés', exact: true }).getAttribute('aria-selected'), 'true');
      await page.keyboard.press('End');
      assert.equal(await page.getByRole('tab', { name: 'Badges', exact: true }).getAttribute('aria-selected'), 'true');
      await page.getByRole('button', { name: 'Ouvrir les familles de badges', exact: false }).click();
      await page.getByRole('button', { name: 'Retour au profil', exact: true }).click();
      await page.getByRole('button', { name: 'Afficher mon activité', exact: true }).click();
      await page.getByRole('region', { name: 'Mon activité', exact: true }).getByRole('heading', { name: 'Lagon Bleu Rooftop Lounge', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Journal XP', exact: true }).click();
      await page.getByText('Visite vérifiée au Lagon Bleu Rooftop (+50 XP)', { exact: true }).waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Volet activité sans débordement ${width}px`);
      await page.getByRole('button', { name: 'Gérer mon compte', exact: true }).click();
      await page.getByRole('heading', { name: 'Compte & Environnement', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Fermer le compte', exact: true }).click();
      await page.reload();
      await page.getByRole('button', { name: 'Profil', exact: true }).click();
      await publications.getByText(text, { exact: true }).waitFor();
      assert.equal(await firstPost.getByRole('button', { name: 'Aimer cette publication', exact: true }).getAttribute('aria-pressed'), 'true');
      assert.equal(await firstPost.getByRole('button', { name: 'Enregistrer le lieu de cette publication', exact: true }).getAttribute('aria-pressed'), 'true');
      await firstPost.getByRole('button', { name: 'Commentaires de cette publication', exact: true }).click();
      await firstPost.getByText('Une adresse à garder pour la prochaine sortie.', { exact: true }).waitFor();
      await page.getByText(/1240 XP au total/).waitFor();
      if (width === 320) {
        await page.getByRole('button', { name: 'Valider ma présence physique', exact: true }).click();
        const dialog = page.getByRole('dialog', { name: 'Check-in', exact: true });
        await dialog.getByRole('button', { name: /Maquis L'Étoile/ }).click();
        await dialog.getByRole('button', { name: 'Simuler ma visite', exact: true }).click();
        await dialog.getByRole('heading', { name: 'Visite simulée enregistrée !', exact: true }).waitFor();
        await dialog.getByRole('button', { name: 'Plus tard (Terminer)', exact: true }).click();
        await page.getByRole('button', { name: 'Profil', exact: true }).click();
        await page.getByText(/1315 XP au total/).waitFor();
        await page.getByRole('button', { name: 'Afficher mon activité', exact: true }).click();
        const activity = page.getByRole('region', { name: 'Mon activité', exact: true });
        await activity.getByRole('heading', { name: /Maquis L'Étoile/ }).waitFor();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Une visite enregistrée reste lisible à 320px');
        await activity.getByRole('button', { name: 'Journal XP', exact: true }).click();
        await activity.getByText(/\+75 XP/).first().waitFor();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Le journal XP reste lisible à 320px');
      }
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`  Profil ${width}px : onglets, thèmes, réaction, commentaire, lieu enregistré, activité, compte et rechargement OK`);
    }
  } finally { await browser.close(); }
}
