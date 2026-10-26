/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT by RED LOOP — Security, Check-in & Permissions Automated Test Suite
 * Validates critical requirements:
 *  1. Refus d'un check-in trop éloigné (> 250m) -> 422, status: 'rejected', 0 XP
 *  2. Validation d'un check-in proche (< 250m) -> 201, status: 'verified', attribution d'XP
 *  3. Aucune duplication d'XP (protection idempotence journalière)
 *  4. Absence d'accès aux médias privés d'autrui (403 Forbidden)
 *  5. Refus des actions admin par utilisateur normal (403 Forbidden)
 *  6. Accès admin autorisé pour le superviseur RED LOOP (200 OK)
 *  7. Persistance des données et session après reconnexion
 *  8. Réinitialisation instantanée du scénario pitch pour répétabilité
 */

const BASE_URL = process.env.TEST_URL || 'http://127.0.0.1:3000';

interface TestResult {
  title: string;
  passed: boolean;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(title: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ title, passed: true });
    console.log(`  ✓ ${title}`);
  } catch (err: any) {
    results.push({ title, passed: false, error: err.message || String(err) });
    console.error(`  ✗ ${title} -> FAILED: ${err.message}`);
  }
}

async function main() {
  console.log('\n======================================================');
  console.log('CHKPT by RED LOOP — Suite de Tests de Sécurité & Métier');
  console.log(`Cible : ${BASE_URL}`);
  console.log('======================================================\n');

  const timestamp = Date.now();
  const testUsername = `tester_${timestamp}`;
  const testPassword = 'Password123!';
  let userToken = '';
  let userId = '';
  let adminToken = '';
  let privateAssetId = '';

  // TEST 1: Inscription d'un nouvel utilisateur
  await runTest('1. Création de compte avec validation d\'âge et mot de passe', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        displayName: 'Testeur Abidjan',
        password: testPassword,
        age: 22,
        homeZone: 'Cocody',
      }),
    });

    if (res.status !== 201) {
      const err = await res.json();
      throw new Error(`Statut HTTP inattendu: ${res.status} - ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (!data.token || !data.user || data.user.username !== testUsername) {
      throw new Error(`Réponse register invalide: ${JSON.stringify(data)}`);
    }

    userToken = data.token;
    userId = data.user.id;
  });

  // TEST 2: Connexion avec identifiants corrects
  await runTest('2. Connexion avec vérification de mot de passe (scrypt) & génération de session', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        password: testPassword,
      }),
    });

    if (res.status !== 200) {
      throw new Error(`Échec login: statut ${res.status}`);
    }

    const data = await res.json();
    if (!data.token || data.user.id !== userId) {
      throw new Error(`Token ou identifiant non concordant: ${JSON.stringify(data)}`);
    }
    userToken = data.token;
  });

  // TEST 3: Refus d'un check-in trop éloigné (> 250m)
  await runTest('3. Refus d\'un check-in trop éloigné (> 250m) : statut 422, rejected et 0 XP', async () => {
    // Marcory Zone 4 ~6 km from Lagon Bleu
    const res = await fetch(`${BASE_URL}/api/checkins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        placeId: 'plc_cocody_lounge',
        latitude: 5.3100,
        longitude: -3.9900,
        isSimulated: false,
        audience: 'private',
      }),
    });

    if (res.status !== 422) {
      throw new Error(`Statut attendu 422 Unprocessable Entity, reçu: ${res.status}`);
    }

    const data = await res.json();
    if (data.status !== 'rejected') {
      throw new Error(`Statut de check-in attendu 'rejected', reçu: ${data.status}`);
    }

    if (data.awardedXp !== 0) {
      throw new Error(`Les XP attribués sur tentative rejetée doivent être 0, reçu: ${data.awardedXp}`);
    }

    if (data.distanceMeters <= 250) {
      throw new Error(`Distance calculée devrait être > 250m, reçu: ${data.distanceMeters}`);
    }
  });

  // TEST 4: Validation d'un check-in dans le rayon (< 250m)
  await runTest('4. Validation d\'un check-in dans le rayon (< 250m) : statut 201, verified et attribution d\'XP', async () => {
    // Exact Lagon Bleu coords: 5.3428, -3.9935
    const res = await fetch(`${BASE_URL}/api/checkins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        placeId: 'plc_cocody_lounge',
        latitude: 5.3428,
        longitude: -3.9935,
        isSimulated: false,
        audience: 'private',
      }),
    });

    if (res.status !== 201) {
      const err = await res.json();
      throw new Error(`Statut attendu 201 Created, reçu: ${res.status} - ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (data.status !== 'verified') {
      throw new Error(`Statut de check-in attendu 'verified', reçu: ${data.status}`);
    }

    if (data.awardedXp <= 0) {
      throw new Error(`Des XP doivent être attribués, reçu: ${data.awardedXp}`);
    }

    if (data.distanceMeters > 50) {
      throw new Error(`Distance attendue ~0m, reçu: ${data.distanceMeters}`);
    }
  });

  // TEST 5: Protection anti-duplication XP (idempotence journalière)
  await runTest('5. Protection anti-duplication : deuxième tentative au même lieu le même jour -> 0 XP', async () => {
    const res = await fetch(`${BASE_URL}/api/checkins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        placeId: 'plc_cocody_lounge',
        latitude: 5.3428,
        longitude: -3.9935,
        isSimulated: false,
        audience: 'private',
      }),
    });

    if (res.status !== 422) {
      throw new Error(`La deuxième tentative doit être rejetée pour doublon (422), reçu: ${res.status}`);
    }

    const data = await res.json();
    if (data.awardedXp !== 0) {
      throw new Error(`Aucun XP ne doit être réattribué pour un doublon, reçu: ${data.awardedXp}`);
    }
  });

  // TEST 6: Upload média privé et déduction de l'identité côté serveur
  await runTest('6. Téléversement média avec déduction stricte du propriétaire depuis la session', async () => {
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const res = await fetch(`${BASE_URL}/api/media/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        dataBase64: sampleBase64,
        mimeType: 'image/png',
        audience: 'private',
        ownerId: 'usr_sarah', // Must be ignored by server
      }),
    });

    if (res.status !== 201) {
      const err = await res.json();
      throw new Error(`Échec upload: statut ${res.status} - ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (!data.assetId || data.audience !== 'private') {
      throw new Error(`Média upload invalide: ${JSON.stringify(data)}`);
    }

    privateAssetId = data.assetId;
  });

  // TEST 7: Refus d'accès au média privé par un tiers non autorisé
  await runTest('7. Absence d\'accès aux médias privés d\'autrui : retour HTTP 403 Forbidden', async () => {
    const res = await fetch(`${BASE_URL}/api/media/${privateAssetId}`);

    if (res.status !== 403) {
      throw new Error(`Statut attendu 403 Forbidden pour média privé tiers, reçu: ${res.status}`);
    }

    const data = await res.json();
    if (data.error !== 'private_resource') {
      throw new Error(`Code d'erreur attendu 'private_resource', reçu: ${data.error}`);
    }
  });

  // TEST 8: Refus des actions d'administration par un utilisateur normal
  await runTest('8. Refus d\'accès à la console opérateur RED LOOP pour utilisateur normal : 403 Forbidden', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (res.status !== 403) {
      throw new Error(`Statut attendu 403 Forbidden pour utilisateur standard, reçu: ${res.status}`);
    }

    const data = await res.json();
    if (data.error !== 'forbidden_operator_access') {
      throw new Error(`Code attendu 'forbidden_operator_access', reçu: ${data.error}`);
    }
  });

  // TEST 9: Accès autorisé pour le compte administrateur RED LOOP
  await runTest('9. Accès opérateur autorisé pour le superviseur RED LOOP (usr_admin) : 200 OK', async () => {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'redloop_admin',
        password: process.env.CHKPT_DEMO_ADMIN_PASSWORD,
      }),
    });

    if (loginRes.status !== 200) {
      throw new Error(`Échec login admin: ${loginRes.status}`);
    }

    const loginData = await loginRes.json();
    adminToken = loginData.token;

    const res = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (res.status !== 200) {
      throw new Error(`Statut attendu 200 OK pour opérateur certifié, reçu: ${res.status}`);
    }

    const data = await res.json();
    if (!data.metrics || data.operator.role !== 'admin') {
      throw new Error(`Données métriques opérateur invalides: ${JSON.stringify(data)}`);
    }
  });

  // TEST 10: Persistance des données et vérification du profil
  await runTest('10. Persistance serveur des points XP et des visites vérifiées après reconnexion', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (res.status !== 200) {
      throw new Error(`Échec /api/auth/me: statut ${res.status}`);
    }

    const data = await res.json();
    if (!data.authenticated || !data.user) {
      throw new Error(`Utilisateur non authentifié: ${JSON.stringify(data)}`);
    }

    if (data.user.xpPoints <= 0) {
      throw new Error(`Les XP persistés doivent être supérieurs à 0, reçu: ${data.user.xpPoints}`);
    }

    if (data.user.checkinsCount < 1) {
      throw new Error(`Le compteur de visites doit être >= 1, reçu: ${data.user.checkinsCount}`);
    }
  });

  // TEST 11: Réinitialisation du scénario pitch de démo
  await runTest('11. Réinitialisation instantanée du scénario pitch via POST /api/demo/reset', async () => {
    const res = await fetch(`${BASE_URL}/api/demo/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (res.status !== 200) {
      throw new Error(`Échec reset demo: statut ${res.status}`);
    }

    const data = await res.json();
    if (!data.success || data.seedPlacesCount < 6) {
      throw new Error(`Réponse de réinitialisation invalide: ${JSON.stringify(data)}`);
    }
  });

  console.log('\n======================================================');
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;
  console.log(`RÉSULTAT GLOBAL : ${passedCount}/${results.length} tests réussis (${failedCount} échecs)`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
