import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, cp, symlink, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { chromium } from 'playwright';

/** Exercise the actual dev server; production-only tests cannot catch HMR reloads. */
export async function checkDevStability() {
  const project = fileURLToPath(new URL('..', import.meta.url));
  const runtime = await mkdtemp(path.join(tmpdir(), 'chkpt-dev-stability-'));
  let server: ReturnType<typeof spawn> | undefined;
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  try {
    for (const file of ['src', 'shared', 'server', 'server.ts', 'public', 'index.html', 'vite.config.ts', 'tsconfig.json', 'package.json', 'package-lock.json']) {
      await cp(path.join(project, file), path.join(runtime, file), { recursive: true });
    }
    await symlink(path.join(project, 'node_modules'), path.join(runtime, 'node_modules'));
    // Only allow the linked dependencies in this isolated fixture. The application
    // config is otherwise unchanged. Deliberately omit .gitignore, as with copied folders.
    const config = path.join(runtime, 'vite.config.ts');
    await writeFile(config, (await readFile(config, 'utf8')).replace('server: {',
      `server: { fs: { allow: [${JSON.stringify(runtime)}, ${JSON.stringify(path.join(project, 'node_modules'))}] },`));
    const password = randomBytes(24).toString('hex');
    server = spawn(process.execPath, ['--import', path.join(project, 'node_modules/tsx/dist/loader.mjs'), path.join(runtime, 'server.ts')], {
      cwd: runtime, env: { ...process.env, CHKPT_DATA_DIR:path.join(runtime,'.data'), CHKPT_REMOTE_ACCESS:'false', NODE_ENV: 'development', DISABLE_HMR: 'false', PORT: '0', HOST: '127.0.0.1',
        CHKPT_PRIVATE_DEMO: 'true', CHKPT_DEMO_ADMIN_PASSWORD: password }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    let logs = '';
    server.stdout!.on('data', chunk => { logs += chunk; });
    server.stderr!.on('data', chunk => { logs += chunk; });
    let url: string | undefined;
    for (let i = 0; i < 400; i++) {
      url = logs.match(/CHKPT Fullstack Server running at (http:\/\/\S+)/)?.[1];
      if (url) break;
      if (server.exitCode !== null) throw new Error(logs);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    assert.ok(url, `Le serveur dev doit démarrer : ${logs}`);
    const login = await fetch(url + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'redloop_admin', password }) });
    assert.equal(login.status, 200);
    const admin = await login.json();
    const start = await fetch(url + '/api/demo/start', { method: 'POST', headers: { Authorization: `Bearer ${admin.token}` } });
    assert.equal(start.status, 200);
    const user = await start.json();
    browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
    const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'no-preference' });
    await context.route('https://**/*', route => route.abort());
    await context.addInitScript(({ token, user }) => {
      localStorage.setItem('chkpt_session_token', token);
      localStorage.setItem('chkpt_abidjan_v1_user', JSON.stringify(user));
    }, user);
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    let navigations = 0;
    const hotMessages: string[] = [];
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigations++; });
    page.on('websocket', socket => socket.on('framereceived', frame => hotMessages.push(String(frame.payload))));
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Valider ma présence physique', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Check-in', exact: true });
    await dialog.getByRole('button', { name: /Maquis L'Étoile/ }).click();
    const beforeNavigations = navigations;
    const beforeHot = hotMessages.length;
    await dialog.getByRole('button', { name: 'Confirmer le check', exact: true }).click();
    await dialog.getByRole('heading', { name: 'Visite simulée enregistrée !' }).waitFor();
    await dialog.getByText(/Nouveau Badge débloqué : Initié du Braisé/).waitFor();
    // The watcher reacts asynchronously; verify the confirmation stays readable.
    await page.waitForTimeout(2000);
    assert.equal(navigations, beforeNavigations, `Le check-in ne doit pas recharger la page : ${hotMessages.slice(beforeHot).join('\n')}`);
    assert.ok(!hotMessages.slice(beforeHot).some(message => /"type":"(?:full-reload|update)"/.test(message)), 'Aucune mise à jour de code pour une écriture de données');
    assert.equal(await dialog.getByRole('button', { name: 'Créer une publication', exact: true }).isVisible(), true);
    await dialog.getByRole('button', { name: 'Créer une publication', exact: true }).click();
    await page.getByPlaceholder("Racontez votre expérience, l'ambiance, les plats...").fill('Confirmation stable en mode développement');
    await page.getByRole('button', { name: 'Publier le checkpoint', exact: true }).click();
    await page.getByText('Confirmation stable en mode développement', { exact: true }).waitFor();
    const beforeEdit = hotMessages.length;
    const symbol = path.join(runtime, 'src/components/common/BrandSymbol.tsx');
    await writeFile(symbol, (await readFile(symbol, 'utf8')) + '\n// Source edit used by the dev-server regression test.\n');
    for (let i = 0; i < 100 && !hotMessages.slice(beforeEdit).some(message => message.includes('"type":"update"')); i++) {
      await page.waitForTimeout(50);
    }
    assert.ok(hotMessages.slice(beforeEdit).some(message => message.includes('"type":"update"')), 'Le rechargement à chaud reste actif pour les vraies modifications de code');
    assert.deepEqual(errors, []);
    console.log('  Mode dev : check-in et badge lisibles sans rechargement, publication possible ; HMR source conservé');
  } finally {
    await browser?.close();
    if (server && server.exitCode === null && server.signalCode === null) {
      const stopped = once(server, 'exit');
      server.kill('SIGTERM');
      await stopped;
    }
    await rm(runtime, { recursive: true, force: true });
  }
}
