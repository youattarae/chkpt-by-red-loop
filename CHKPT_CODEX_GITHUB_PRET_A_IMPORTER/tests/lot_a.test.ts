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
async function start(name: string, demo: boolean, presentation = false, extraEnv: Record<string, string> = {}) {
  const cwd = path.join(runtime, name);
  await mkdir(cwd, { recursive: true });
  // Production asset serving keeps API tests independent of the frontend build.
  const child = spawn(process.execPath, ['--import', path.join(project, 'node_modules/tsx/dist/loader.mjs'), path.join(project, presentation ? 'scripts/present.mjs' : 'server.ts')], {
    cwd, env: { ...process.env, CHKPT_DATA_DIR:path.join(cwd,'.data'), PORT: '0', HOST: '127.0.0.1', NODE_ENV: presentation ? 'development' : 'production',
      CHKPT_PRIVATE_DEMO: String(demo), CHKPT_DEMO_ADMIN_PASSWORD: demo ? password : '', CHKPT_REMOTE_ACCESS: 'false', ...extraEnv },
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
    assert.equal((await request(demo.url, route, undefined, outsider.token)).status, 403);
    assert.equal((await request(demo.url, route, undefined, admin)).status, 403);
    assert.equal((await request(demo.url, route)).status, 401);
    assert.equal((await (await request(demo.url, route, undefined, user.token)).json()).checkins.length, 1);
    const publicVisit = await request(demo.url, '/api/checkins', { ...checkin, audience: 'public' }, outsider.token);
    assert.equal(publicVisit.status, 201);
    const publicRoute = `/api/checkins/history?userId=${outsider.user.id}`;
    assert.equal((await request(demo.url, publicRoute, undefined, user.token)).status, 403, 'Même un check public reste dans un historique réservé au propriétaire');
    assert.equal((await (await request(demo.url, '/api/checkins/history', undefined, outsider.token)).json()).checkins.length, 1);
  });
  await check('Profils publics et suivi authentifié, idempotent ; profils privés et mineurs protégés', async () => {
    const route = '/api/profiles/usr_sarah';
    assert.equal((await request(demo.url, route)).status, 401);
    const profile = await (await request(demo.url, route, undefined, user.token)).json();
    assert.equal(profile.profile.displayName, 'Sarah Diallo');
    for (const forbidden of ['passwordHash', 'salt', 'age', 'role', 'checkins', 'xpPoints']) assert.ok(!(forbidden in profile.profile));
    const follow = route + '/follow';
    const before = profile.profile.followersCount;
    for (let i = 0; i < 2; i++) {
      const result = await (await request(demo.url, follow, { following: true, userId: outsider.user.id }, user.token)).json();
      assert.equal(result.followersCount, before + 1);
      assert.ok(result.followingIds.includes('usr_sarah'));
    }
    for (let i = 0; i < 2; i++) {
      const result = await (await request(demo.url, follow, { following: false }, user.token)).json();
      assert.equal(result.followersCount, before);
      assert.ok(!result.followingIds.includes('usr_sarah'));
    }
    assert.equal((await request(demo.url, `/api/profiles/${user.user.id}/follow`, { following: true }, user.token)).status, 400);
    assert.equal((await request(demo.url, '/api/profiles/usr_admin/follow', { following: true }, user.token)).status, 403);
    const minor = await register(demo.url, 'follow_minor', 16);
    const hidden = await (await request(demo.url, `/api/profiles/${minor.user.id}`, undefined, user.token)).json();
    assert.equal(hidden.profile.visibility, 'private');
    assert.ok(!('bio' in hidden.profile));
    assert.equal((await request(demo.url, `/api/profiles/${minor.user.id}/follow`, { following: true }, user.token)).status, 403);
    assert.equal((await request(demo.url, '/api/profiles/usr_02', undefined, user.token)).status, 200);
  });
  await check('Accès distant : protection de toutes les routes, cookie sécurisé, déconnexion et limitation', async () => {
    const accessPassword = randomBytes(24).toString('hex');
    const remote = await start('remote', true, false, { CHKPT_REMOTE_ACCESS: 'true', CHKPT_ACCESS_PASSWORD: accessPassword });
    await symlink(path.join(project, 'dist'), path.join(remote.cwd, 'dist'));
    const headers = { 'x-forwarded-proto': 'https' };
    assert.equal((await fetch(remote.url)).status, 426);
    const landing = await fetch(remote.url, { headers });
    assert.match(await landing.text(), /Accès privé CHKPT/);
    for (const route of ['/api/places', '/api/auth/me', '/assets/example.js', '/illustrations/maquis-demo.png']) {
      assert.equal((await fetch(remote.url + route, { headers })).status, 401);
    }
    const foreign = await fetch(remote.url + '/demo-access', { method: 'POST', headers: { ...headers, Origin: 'https://untrusted.invalid' }, body: new URLSearchParams({ password: accessPassword }), redirect: 'manual' });
    assert.equal(foreign.status,403);
    const response = await fetch(remote.url + '/demo-access', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ password: accessPassword }), redirect: 'manual' });
    assert.equal(response.status, 303);
    const cookie = response.headers.get('set-cookie')!;
    for (const attr of ['HttpOnly', 'Secure', 'SameSite=Strict']) assert.ok(cookie.includes(attr));
    const authorized = { ...headers, Cookie: cookie.split(';')[0] };
    assert.equal((await fetch(remote.url + '/api/places', { headers: authorized })).status, 200);
    assert.equal((await fetch(remote.url + '/api/demo/start', { method: 'POST', headers: authorized })).status, 401, 'Le mot de passe visiteur ne donne aucun rôle opérateur');
    assert.equal((await fetch(remote.url + '/demo-access/logout', { method: 'POST', headers: authorized, redirect: 'manual' })).status, 303);
    assert.equal((await fetch(remote.url + '/api/places', { headers: authorized })).status, 401);
    if (process.argv.includes('--browser')) {
      const { checkRemoteBrowser } = await import('./remote_browser');
      await checkRemoteBrowser(remote.url, accessPassword);
    }
    for (let i = 0; i < 6; i++) {
      const failed = await fetch(remote.url + '/demo-access', { method: 'POST', headers, body: 'password=wrong' });
      assert.equal(failed.status, i < 5 ? 401 : 429);
    }
    await stop(remote.child);
  });
  await check('Accès distant incomplet : refus de démarrer', async () => {
    await assert.rejects(() => start('remote-invalid', true, false, { CHKPT_REMOTE_ACCESS: 'true', CHKPT_ACCESS_PASSWORD: '' }), /Remote access requires/);
    await assert.rejects(() => start('remote-same-password', true, false, { CHKPT_REMOTE_ACCESS: 'true', CHKPT_ACCESS_PASSWORD: password }), /Remote access requires/);
  });
  await check('Avis : note et texte validés, auteur imposé, modification et confidentialité', async () => {
    const route = '/api/places/plc_maquis_etoile/reviews';
    assert.equal((await request(demo.url, route, { rating: 5, comment: 'Exemple' })).status, 401);
    for (const rating of [0,6,2.5,'5',null]) assert.equal((await request(demo.url, route, { rating, comment: 'Exemple' }, user.token)).status,400);
    for (const comment of ['', 'ab', 'x'.repeat(1001), null]) assert.equal((await request(demo.url, route, { rating: 5, comment }, user.token)).status,400);
    assert.equal((await request(demo.url, route, { rating: 5, comment: 'Une belle ambiance.', userId: outsider.user.id }, user.token)).status,200);
    assert.equal((await request(demo.url, route, { rating: 4, comment: 'Avis modifié.' }, user.token)).status,200);
    const reviews = (await (await request(demo.url, route)).json()).reviews;
    assert.equal(reviews.length,1); assert.equal(reviews[0].userId,user.user.id); assert.equal(reviews[0].rating,4);
    assert.equal((await request(demo.url, route, { rating: 5, comment: 'Exemple' }, admin)).status,403);
  });
  await check('Badges serveur : 40 paliers, preuves événement/photo et absence de doublons', async () => {
    const switched = await request(demo.url,'/api/auth/switch-demo',{username:'koffi_urbex'},admin);
    const actor = await switched.json();
    const state = await (await request(demo.url,'/api/badges',undefined,actor.token)).json();
    assert.equal(state.badges.length,40);assert.equal(new Set(state.badges.map((badge:any)=>badge.family)).size,8);
    const catalog = await (await request(demo.url,'/api/events')).json();
    const active = catalog.events.find((event:any)=>event.placeId==='plc_maquis_etoile');
    const place = (await (await request(demo.url,'/api/places')).json()).places.find((place:any)=>place.id==='plc_maquis_etoile');
    const payload={placeId:place.id,latitude:place.coordinates.lat,longitude:place.coordinates.lng,isSimulated:true,audience:'private'};
    assert.equal((await request(demo.url,'/api/checkins',{...payload,eventId:'evt_01'},actor.token)).status,422);
    const saved = await (await request(demo.url,'/api/checkins',{...payload,eventId:active.id},actor.token)).json();
    assert.ok(saved.newlyUnlocked.some((badge:any)=>badge.family==='Maquis Master'));
    assert.ok(saved.newlyUnlocked.some((badge:any)=>badge.family==='Event Hunter'));
    assert.equal(saved.awardedXp,75,'Les badges ne créent pas de bonus XP caché');
    assert.equal((await request(demo.url,'/api/checkins',{...payload,eventId:active.id},actor.token)).status,422);
    assert.equal((await (await request(demo.url,'/api/badges',undefined,actor.token)).json()).newlyUnlocked.length,0);
    for(const file of ['maquis-demo.png','rooftop-demo.png']) {
      const dataBase64='data:image/png;base64,'+(await readFile(path.join(project,'public/illustrations',file))).toString('base64');
      const media=await (await request(demo.url,'/api/media/upload',{mimeType:'image/png',dataBase64,audience:'private'},actor.token)).json();
      assert.equal((await request(demo.url,'/api/badges/photo',{checkinId:saved.checkIn.id,mediaUrl:media.readUrl},outsider.token)).status,403);
      assert.equal((await request(demo.url,'/api/posts',{text:'Photo publiée pour la démonstration.',mediaUrl:media.readUrl,linkedPlaceId:place.id,linkedCheckinId:saved.checkIn.id,audience:'private',clientRequestId:'proof_'+file.replace(/[.-]/g,'_')},actor.token)).status,201);
      const photo=await (await request(demo.url,'/api/badges/photo',{checkinId:saved.checkIn.id,mediaUrl:media.readUrl},actor.token)).json();
      assert.ok(photo.badges.find((badge:any)=>badge.id==='bdg_photographe_bronze').currentCount<=5);
      const repeated=await (await request(demo.url,'/api/badges/photo',{checkinId:saved.checkIn.id,mediaUrl:media.readUrl},actor.token)).json();
      assert.equal(repeated.newlyUnlocked.length,0);
    }
    assert.equal((await (await request(demo.url,'/api/badges',undefined,actor.token)).json()).badges.find((badge:any)=>badge.id==='bdg_photographe_bronze').isUnlocked,true);
  });
  await check('Catalogue complet : les 40 paliers sont atteignables et journalisés une seule fois', async () => {
    const cwd=path.join(runtime,'badge-catalog');await mkdir(cwd);
    const child=spawn(process.execPath,['--import',path.join(project,'node_modules/tsx/dist/loader.mjs'),path.join(project,'tests/badge_catalog_test.ts')],{cwd,env:{...process.env,CHKPT_DATA_DIR:path.join(cwd,'.data'),CHKPT_PRIVATE_DEMO:'false'},stdio:['ignore','pipe','pipe']});
    let output='';child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>output+=chunk);
    assert.equal((await once(child,'exit'))[0],0,output);
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
      cwd, env: { ...process.env, CHKPT_DATA_DIR:path.join(cwd,'.data'), CHKPT_PRIVATE_DEMO: 'true', CHKPT_DEMO_ADMIN_PASSWORD: '' }, stdio: ['ignore', 'pipe', 'pipe'],
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
        cwd, env: {...process.env, CHKPT_DATA_DIR:path.join(cwd,'.data'), CHKPT_PRIVATE_DEMO:'false'}, stdio:['ignore','pipe','pipe']
      });
      let output = '';
      child.stderr!.on('data', chunk => {output += chunk;});
      assert.notEqual((await once(child, 'exit'))[0], 0);
      assert.match(output, /préserver le fichier existant/);
      assert.equal(await readFile(file, 'utf8'), contents);
    }
  });
  const {checkStories}=await import('./stories_test');
  await check('Stories : expiration serveur, confidentialité, suppression et stockage',()=>checkStories(start,stop,password));
  const {checkSharedState}=await import('./shared_state_test');
  await check('Données partagées, médias persistants, confidentialité et sauvegarde chiffrée restaurable',()=>checkSharedState(start,stop,password));
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
    const { checkLargePlace } = await import('./place_browser');
    await check('GPS avec commune et fiches lieu grand format, galerie et favoris', () => checkLargePlace(demo.url));
    const { checkShareHistory } = await import('./share_history_browser');
    await check('Partage natif ou copie, lien direct et historique personnel des lieux visités', () => checkShareHistory(demo.url, password));
    const { checkNextFeatures } = await import('./next_features_browser');
    await check('Bienvenue, recherche, récompense, aperçu établissement et profils suivis', () => checkNextFeatures(demo.url, password));
    const { checkRadarMap } = await import('./radar_browser');
    await check('Carte interactive, radar de 250 m, catégories et secours hors connexion', () => checkRadarMap(demo.url));
    const {checkSharedBrowsers}=await import('./shared_state_browser');
    await check('Deux navigateurs : publications, favoris, visites et photo privée, reprise sans doublon',()=>checkSharedBrowsers(demo.url,password));
    const {checkPostMedia}=await import('./post_media_browser');
    await check('Publication : quatre photos/vidéos, import, lecture et rechargement mobile',()=>checkPostMedia(demo.url,password));
    const {checkStoryBrowsers}=await import('./stories_browser');
    await check('Stories mobiles : ajout, profil, avatar, deux appareils et suppression',()=>checkStoryBrowsers(demo.url,password));
    const { checkSupport } = await import('./support_browser');
    await check('Support de secours autonome, quatre captures lisibles sans connexion', checkSupport);
  }
  console.log(`Prototype CHKPT : ${checks}/${checks} groupes réussis (suite historique de 11 tests comprise).`);
} finally {
  await Promise.all([...processes].map(stop));
  await rm(runtime, { recursive: true, force: true });
}
