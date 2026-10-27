import assert from 'node:assert/strict';
import { spawn, ChildProcess } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scryptSync } from 'node:crypto';
import { once } from 'node:events';

const project = fileURLToPath(new URL('..', import.meta.url));
const runtime = await mkdtemp(path.join(tmpdir(), 'chkpt-lot-a-'));
const password = randomBytes(24).toString('hex');
const processes = new Set<ChildProcess>();
let checks = 0;
async function check(title: string, fn: () => Promise<void>) {
  await fn();
  console.log(`✓ ${++checks}. ${title}`);
}
async function stop(child: ChildProcess) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = once(child, 'exit');
  child.kill('SIGTERM');
  await exited;
  processes.delete(child);
}
async function start(name: string, demo: boolean, presentation = false) {
  const cwd = path.join(runtime, name);
  await mkdir(cwd, { recursive: true });
  // Production asset serving keeps API tests independent of the frontend build.
  const child = spawn(process.execPath, ['--import', path.join(project, 'node_modules/tsx/dist/loader.mjs'), path.join(project, presentation ? 'scripts/present.mjs' : 'server.ts')], {
    cwd, env: { ...process.env, PORT: '0', HOST: '127.0.0.1', NODE_ENV: presentation ? 'development' : 'production',
      CHKPT_PRIVATE_DEMO: String(demo), CHKPT_DEMO_ADMIN_PASSWORD: demo ? password : '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  processes.add(child);
  let output = '';
  child.stdout!.on('data', chunk => { output += chunk; });
  child.stderr!.on('data', chunk => { output += chunk; });
  for (let i = 0; i < 200; i++) {
    const match = output.match(/CHKPT Fullstack Server running at (http:\/\/[^\s]+)/);
    if (match) return { url: match[1], child, cwd };
    if (child.exitCode !== null) throw new Error(`Server exited: ${output}`);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error(`Server did not become ready: ${output}`);
}
async function request(url: string, route: string, body?: unknown, token?: string) {
  return fetch(url + route, { method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
async function register(url: string, username: string, age = 22) {
  const response = await request(url, '/api/auth/register', { username, password, age });
  assert.equal(response.status, 201);
  return response.json();
}
async function login(url: string) {
  const response = await request(url, '/api/auth/login', { username: 'redloop_admin', password });
  assert.equal(response.status, 200);
  return (await response.json()).token as string;
}
try {
  const safe = await start('safe', false);
  const demo = await start('demo', true);
  const user = await register(demo.url, 'lot_a_user');
  const outsider = await register(demo.url, 'lot_a_outsider');
  const publicUser = await register(safe.url, 'lot_a_public');
  const admin = await login(demo.url);
  const checkin = { placeId: 'plc_maquis_etoile', latitude: 5.3505, longitude: -3.9941,
    isSimulated: true, audience: 'private', environment: 'demo' };

  await check('Outils démo fermés par défaut, même avec un mode envoyé par le client', async () => {
    for (const route of ['/api/auth/switch-demo', '/api/demo/reset', '/api/demo/start']) {
      assert.equal((await request(safe.url, route, { username: 'redloop_admin', environment: 'demo' }, publicUser.token)).status, 403);
    }
  });
  await check('Démo privée : refus anonyme et refus du compte ordinaire pour bascule et reset', async () => {
    for (const route of ['/api/auth/switch-demo', '/api/demo/reset', '/api/demo/start']) {
      assert.equal((await request(demo.url, route, { username: 'redloop_admin' })).status, 401);
      assert.equal((await request(demo.url, route, { username: 'redloop_admin' }, user.token)).status, 403);
    }
  });
  await check('Anciens mots de passe et jetons de seed inutilisables dans les deux modes', async () => {
    for (const url of [safe.url, demo.url]) {
      for (const [username, oldPassword, token] of [
        ['redloop_admin', 'admin123', 'demo_session_admin_token_67890'],
        ['koffi_urbex', 'koffi123', 'demo_session_koffi_token_12345'],
        ['sarah_dlo', 'sarah123', 'demo_session_sarah_token_99999'],
      ]) {
        assert.equal((await request(url, '/api/auth/login', { username, password: oldPassword })).status, 401);
        assert.equal((await request(url, '/api/auth/me', undefined, token)).status, 200);
        assert.equal((await (await request(url, '/api/auth/me', undefined, token)).json()).authenticated, false);
      }
    }
  });
  await check('Simulation refusée par le serveur par défaut malgré environment=demo', async () => {
    const response = await request(safe.url, '/api/checkins', checkin, publicUser.token);
    assert.equal(response.status, 422);
    const data = await response.json();
    assert.equal(data.rejectionReason, 'simulated_location_forbidden');
    assert.equal(data.awardedXp, 0);
  });
  const places = (await (await request(demo.url, '/api/places')).json()).places;
  const maquis = places.find((p: any) => p.id === checkin.placeId);
  checkin.latitude = maquis.coordinates.lat;
  checkin.longitude = maquis.coordinates.lng;
  await check('Démo : bon lieu, simulation explicite, XP et refus du doublon', async () => {
    const response = await request(demo.url, '/api/checkins', checkin, user.token);
    assert.equal(response.status, 201);
    const data = await response.json();
    assert.equal(data.checkIn.placeId, checkin.placeId);
    assert.match(data.message, /simulée/);
    assert.equal(data.awardedXp, 75);
    const duplicate = await request(demo.url, '/api/checkins', checkin, user.token);
    assert.equal(duplicate.status, 422);
    assert.equal((await duplicate.json()).awardedXp, 0);
  });
  await check('Historique privé masqué pour un tiers et visible pour son auteur', async () => {
    const route = `/api/checkins/history?userId=${user.user.id}`;
    assert.equal((await (await request(demo.url, route, undefined, outsider.token)).json()).checkins.length, 0);
    assert.equal((await (await request(demo.url, route, undefined, user.token)).json()).checkins.length, 1);
  });
  await check('Coordonnées invalides : aucun XP ni validation', async () => {
    for (const latitude of [91, null, 'NaN']) {
      assert.equal((await request(demo.url, '/api/checkins', { ...checkin, latitude }, outsider.token)).status >= 400, true);
    }
  });
  await check('Mineur inscrit : profil et médias privés imposés', async () => {
    const minor = await register(demo.url, 'lot_a_minor', 15);
    assert.equal(minor.user.visibility, 'private');
    const upload = await request(demo.url, '/api/media/upload', {
      dataBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      mimeType:'image/png', audience:'public'
    }, minor.token);
    assert.equal(upload.status,201);
    const media = await upload.json();
    assert.equal(media.audience,'private');
    assert.equal((await request(demo.url, '/api/media/'+media.assetId)).status,403);
    assert.equal((await request(demo.url, '/api/media/'+media.assetId, undefined, outsider.token)).status,403);
    assert.equal((await request(demo.url, '/api/media/'+media.assetId, undefined, minor.token)).status,200);
  });
  await check('Opérateur autorisé : personas, refus de cible arbitraire et reset', async () => {
    assert.equal((await request(demo.url, '/api/auth/switch-demo', { username: 'lot_a_user' }, admin)).status, 404);
    assert.equal((await request(demo.url, '/api/auth/switch-demo', { username: 'koffi_urbex' }, admin)).status, 200);
    assert.equal((await request(demo.url, '/api/demo/reset', {}, admin)).status, 200);
    assert.equal((await (await request(demo.url, '/api/auth/me', undefined, admin)).json()).authenticated, false);
  });
  await check('Suite historique : 11 tests, reset désormais authentifié', async () => {
    const child = spawn(path.join(project, 'node_modules/.bin/tsx'), ['tests/security_and_checkin.test.ts'], {
      cwd: project, env: { ...process.env, TEST_URL: demo.url, CHKPT_DEMO_ADMIN_PASSWORD: password }, stdio: 'inherit',
    });
    assert.equal((await once(child, 'exit'))[0], 0);
  });
  await check('Migration : anciens accès supprimés, utilisateur et données conservés', async () => {
    await stop(safe.child);
    const file = path.join(safe.cwd, '.data/chkpt_db.json');
    const data = JSON.parse(await readFile(file, 'utf8'));
    const legacyAdmin = data.users.find((user: any) => user.id === 'usr_admin');
    legacyAdmin.passwordHash = scryptSync('admin123', legacyAdmin.salt, 64).toString('hex');
    data.sessions.push({ token: 'invalid-expiry-test', userId: publicUser.user.id, createdAt: new Date().toISOString(), expiresAt: 'invalid-date' });
    data.sessions.push({ token: 'demo_session_admin_token_67890', userId: 'usr_admin',
      createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString() });
    await writeFile(file, JSON.stringify(data));
    const restarted = await start('safe', false);
    assert.equal((await (await request(restarted.url, '/api/auth/me', undefined, 'demo_session_admin_token_67890')).json()).authenticated, false);
    assert.equal((await (await request(restarted.url, '/api/auth/me', undefined, publicUser.token)).json()).authenticated, true);
    assert.equal((await (await request(restarted.url, '/api/auth/me', undefined, 'invalid-expiry-test')).json()).authenticated, false);
    assert.equal((await request(restarted.url, '/api/auth/login', { username: 'redloop_admin', password: 'admin123' })).status, 401);
  });
  await check('Migration en démo privée : nouveau secret appliqué et anciennes sessions révoquées', async () => {
    const oldToken = await login(demo.url);
    await stop(demo.child);
    const file = path.join(demo.cwd, '.data/chkpt_db.json');
    const data = JSON.parse(await readFile(file, 'utf8'));
    const legacyAdmin = data.users.find((user: any) => user.id === 'usr_admin');
    legacyAdmin.passwordHash = scryptSync('admin123', legacyAdmin.salt, 64).toString('hex');
    await writeFile(file, JSON.stringify(data));
    const restarted = await start('demo', true);
    Object.assign(demo, restarted);
    assert.equal((await (await request(demo.url, '/api/auth/me', undefined, oldToken)).json()).authenticated, false);
    assert.equal((await request(demo.url, '/api/auth/login', { username: 'redloop_admin', password: 'admin123' })).status, 401);
    assert.ok(await login(demo.url));
  });
  await check('Démo privée sans secret : démarrage refusé', async () => {
    const cwd = path.join(runtime, 'no-secret');
    await mkdir(cwd);
    const child = spawn(process.execPath, ['--import', path.join(project, 'node_modules/tsx/dist/loader.mjs'), path.join(project, 'server.ts')], {
      cwd, env: { ...process.env, CHKPT_PRIVATE_DEMO: 'true', CHKPT_DEMO_ADMIN_PASSWORD: '' }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    processes.add(child);
    let output = '';
    child.stderr!.on('data', chunk => { output += chunk; });
    assert.notEqual((await once(child, 'exit'))[0], 0);
    assert.match(output, /at least 16 characters/);
    processes.delete(child);
  });
  await check('Base endommagée : refus de démarrer sans modifier les données existantes', async () => {
    for (const [index, contents] of ['{broken', JSON.stringify({users: []})].entries()) {
      const cwd = path.join(runtime, `corrupt-${index}`);
      await mkdir(path.join(cwd, '.data'), {recursive: true});
      const file = path.join(cwd, '.data/chkpt_db.json');
      await writeFile(file, contents);
      const child = spawn(process.execPath, ['--import', path.join(project, 'node_modules/tsx/dist/loader.mjs'), path.join(project, 'server.ts')], {
        cwd, env: {...process.env, CHKPT_PRIVATE_DEMO:'false'}, stdio:['ignore','pipe','pipe']
      });
      let output = '';
      child.stderr!.on('data', chunk => {output += chunk;});
      assert.notEqual((await once(child, 'exit'))[0], 0);
      assert.match(output, /préserver le fichier existant/);
      assert.equal(await readFile(file, 'utf8'), contents);
    }
  });
  if (process.argv.includes('--browser')) {
    await symlink(path.join(project, 'dist'), path.join(demo.cwd, 'dist'));
    await check('Lancement présentation : assets compilés sans Vite, accès démo toujours fermés par défaut', async () => {
      const presentation = await start('presentation', false, true);
      await symlink(path.join(project, 'dist'), path.join(presentation.cwd, 'dist'));
      const response = await fetch(presentation.url);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /\/assets\/index-[^\s"']+\.js/);
      assert.ok(!html.includes('/@vite/client'));
      assert.equal((await request(presentation.url, '/api/demo/start', {})).status, 403);
      assert.equal((await request(presentation.url, '/api/places')).status, 200);
      await stop(presentation.child);
    });
    const { checkBrowser } = await import('./lot_a_browser');
    await check('Navigateur mobile : carte → fiche → check-in, fermeture et autre lieu', () => checkBrowser(demo.url));
    const { checkPresentation } = await import('./presentation_browser');
    await check('Présentation complète et répétition après reset autorisé', () => checkPresentation(demo.url, password));
    const { checkDeepReview } = await import('./deep_review_browser');
    await check('Petit écran, ancienne réponse de connexion, filtre Amis et GPS en attente', () => checkDeepReview(demo.url, password));
    const { checkVisualDirection } = await import('./visual_direction_browser');
    await check('Direction visuelle claire et sombre, symbole et navigation de 320 à 1280px', () => checkVisualDirection(demo.url));
    const { checkDevStability } = await import('./dev_stability_browser');
    await check('Mode dev : confirmation persistante, aucune recharge pour les données et HMR source conservé', checkDevStability);
    const { checkProfile } = await import('./profile_browser');
    await check('Profil social : onglets, interactions partagées, historique et gestion du compte', () => checkProfile(demo.url, password));
    const { checkFeed } = await import('./feed_browser');
    await check('Accueil social : deux onglets, visuels locaux, filtres et confirmation du check', () => checkFeed(demo.url, password));
    const { checkSupport } = await import('./support_browser');
    await check('Support de secours autonome, quatre captures lisibles sans connexion', checkSupport);
  }
  console.log(`Prototype CHKPT : ${checks}/${checks} contrôles réussis (+ 11 tests historiques).`);
} finally {
  await Promise.all([...processes].map(stop));
  await rm(runtime, { recursive: true, force: true });
}
