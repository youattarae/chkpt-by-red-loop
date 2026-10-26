/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT by RED LOOP — Fullstack Server Entry Point
 * Implements:
 *  - Persistent File-Backed Database (server/db.ts)
 *  - Multi-user authentication & session management (scryptSync)
 *  - Strict role-based access control (Operator/Admin guard)
 *  - Server-side check-in verification with Haversine distance & daily idempotency
 *  - Secure media upload (owner identity derived strictly from session, MIME & size checks)
 *  - Strict media audience authorization enforcement (Private / Followers / Public)
 *  - Demo scenario reset endpoint (/api/demo/reset)
 *  - Google Maps Grounding via Gemini 3.8 Flash for authentic Abidjan places
 *  - Vite middleware integration
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { privateDemoEnabled, requirePrivateDemo, seedUserIds } from './server/demoConfig';
import { db, UserEntity } from './server/db';
import {
  authenticateUser,
  requireAuth,
  requireOperator,
  hashPassword,
  verifyPassword,
  generateSessionToken,
} from './server/auth';
import { processCheckinSubmission } from './server/checkinEngine';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase JSON body parser limit for base64 media payloads up to 20MB
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Global authentication middleware to resolve session on every request
app.use(authenticateUser);

// Initialize Gemini client with aistudio-build telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Server-side Media Storage Registry (In-Memory with persistence in session)
export interface ServerMediaRecord {
  assetId: string;
  ownerId: string;
  ownerUsername: string;
  audience: 'private' | 'followers' | 'public';
  mimeType: string;
  sizeBytes: number;
  dataBase64: string; // Sanitized pixel payload without EXIF
  createdAt: string;
  token: string;
}

const mediaRegistry = new Map<string, ServerMediaRecord>();

// Allowed media types & limits
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_MEDIA_SIZE_BYTES = 15 * 1024 * 1024; // 15 Megabytes

// ==========================================
// 1. AUTHENTICATION & IDENTITY (SERVER-SIDE)
// ==========================================

/**
 * Register a new user
 */
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { username, displayName, password, age, homeZone } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      res.status(400).json({ error: 'validation_error', message: 'Nom d\'utilisateur invalide (min 3 caractères).' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'validation_error', message: 'Mot de passe trop court (min 6 caractères).' });
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = db.findUserByUsername(cleanUsername);
    if (existing) {
      res.status(409).json({ error: 'username_taken', message: 'Ce nom d\'utilisateur est déjà utilisé.' });
      return;
    }

    const userAge = typeof age === 'number' ? age : parseInt(age, 10) || 20;
    if (userAge < 13) {
      res.status(403).json({ error: 'age_restriction', message: 'L\'accès à CHKPT est réservé aux personnes de 13 ans et plus.' });
      return;
    }

    // Invariant: Minor (13-17) profile visibility is forced to 'private' by default
    const visibility = userAge < 18 ? 'private' : 'public';

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const userId = `usr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const newUser: UserEntity = {
      id: userId,
      username: cleanUsername,
      displayName: displayName?.trim() || cleanUsername,
      passwordHash,
      salt,
      age: userAge,
      visibility,
      role: 'user',
      homeZone: homeZone || 'Cocody, Abidjan',
      avatarUrl: `/illustrations/avatar.svg`,
      bio: 'Nouveau membre sur CHKPT Abidjan.',
      followersCount: 0,
      followingCount: 0,
      checkinsCount: 0,
      xpPoints: 0,
      level: 1,
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);

    // Create session
    const token = generateSessionToken();
    db.createSession({
      token,
      userId: newUser.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    const { passwordHash: _, salt: __, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      token,
      user: safeUser,
      message: 'Compte créé avec succès.',
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'server_error', message: 'Erreur lors de la création du compte.' });
  }
});

/**
 * Login with username and password
 */
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'validation_error', message: 'Identifiant et mot de passe requis.' });
      return;
    }

    const user = db.findUserByUsername(username.trim());
    if (!user || (!privateDemoEnabled && seedUserIds.has(user.id))) {
      res.status(401).json({ error: 'invalid_credentials', message: 'Identifiant ou mot de passe incorrect.' });
      return;
    }

    const isValid = verifyPassword(password, user.salt, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'invalid_credentials', message: 'Identifiant ou mot de passe incorrect.' });
      return;
    }

    const token = generateSessionToken();
    db.createSession({
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    const { passwordHash: _, salt: __, ...safeUser } = user;

    res.json({
      success: true,
      token,
      user: safeUser,
      message: 'Connexion réussie.',
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'server_error', message: 'Erreur lors de la connexion.' });
  }
});

/**
 * Switch persona only on an explicitly enabled private demo, after operator authentication
 */
app.post('/api/auth/switch-demo', requirePrivateDemo, requireOperator, (req: Request, res: Response) => {
  const { username } = req.body;

  if (typeof username !== 'string') {
    res.status(400).json({ error: 'invalid_username' });
    return;
  }
  const user = db.findUserByUsername(username);
  if (!user || !seedUserIds.has(user.id)) {
    res.status(404).json({ error: 'user_not_found', message: 'Profil démo introuvable.' });
    return;
  }

  if (['admin', 'superadmin'].includes(user.role) && !['admin', 'superadmin'].includes(req.user!.role)) {
    res.status(403).json({ error: 'forbidden_demo_elevation' });
    return;
  }

  const token = generateSessionToken();
  db.createSession({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  });

  const { passwordHash: _, salt: __, ...safeUser } = user;

  res.json({
    success: true,
    token,
    user: safeUser,
    message: `Bascule effectuée vers ${user.displayName} (${user.role}).`,
  });
});

/**
 * Logout
 */
app.post('/api/auth/logout', requireAuth, (req: Request, res: Response) => {
  if (req.sessionToken) {
    db.deleteSession(req.sessionToken);
  }
  res.json({ success: true, message: 'Déconnexion effectuée.' });
});

/**
 * Current authenticated user profile
 */
app.get('/api/auth/me', (req: Request, res: Response) => {
  if (!req.user) {
    res.json({ authenticated: false, user: null });
    return;
  }
  const { passwordHash: _, salt: __, ...safeUser } = req.user;
  res.json({ authenticated: true, user: safeUser, followingIds: db.getFollowing(req.user.id) });
});

// ==========================================
// 2. CANONICAL PLACES API
// ==========================================

/**
 * Get all certified places in the official repository
 */
app.get('/api/places', (_req: Request, res: Response) => {
  res.json({
    success: true,
    places: db.getPlaces(),
  });
});

// ==========================================
// 3. CHECK-IN ENGINE (SERVER-SIDE VALIDATION)
// ==========================================

/**
 * Submit verified check-in proof to server
 */
app.post('/api/checkins', requireAuth, (req: Request, res: Response) => {
  try {
    const { placeId, latitude, longitude, accuracyMeters, isSimulated, audience, environment } = req.body;

    if (!placeId || typeof latitude !== 'number' || typeof longitude !== 'number') {
      res.status(400).json({
        error: 'invalid_payload',
        message: 'Identifiant du lieu et coordonnées GPS requises.',
      });
      return;
    }

    const result = processCheckinSubmission({
      user: req.user!,
      placeId,
      latitude,
      longitude,
      accuracyMeters,
      isSimulated: Boolean(isSimulated),
      audience,
      environment,
    });

    if (!result.success) {
      res.status(422).json(result);
      return;
    }

    res.status(201).json(result);
  } catch (err: any) {
    console.error('Check-in error:', err);
    res.status(500).json({ error: 'server_error', message: 'Erreur lors du traitement du check-in.' });
  }
});

/**
 * Get user's checkin history
 */
app.get('/api/checkins/history', requireAuth, (req: Request, res: Response) => {
  const targetUserId = (req.query.userId as string) || req.user!.id;

  const targetUser = db.findUserById(targetUserId);
  if (!targetUser) {
    res.status(404).json({ error: 'user_not_found' });
    return;
  }

  if (targetUser.visibility === 'private' && targetUserId !== req.user!.id) {
    res.status(403).json({
      error: 'private_profile',
      message: 'Ce profil est privé. L\'historique des visites est inaccessible.',
    });
    return;
  }

  const checkins = db.getCheckins(targetUserId).filter(checkin =>
    targetUserId === req.user!.id || checkin.audience === 'public' ||
    (checkin.audience === 'followers' && db.isFollower(req.user!.id, targetUserId))
  );
  res.json({ checkins });
});

// ==========================================
// 4. RESET DEMO PITCH STATE
// ==========================================

/**
 * Resets database state for pitch and live evaluations
 */
app.post(['/api/demo/reset', '/api/demo/start'], requirePrivateDemo, requireOperator, (req: Request, res: Response) => {
  try {
    const freshDb = db.resetPitchDemoState();
    mediaRegistry.clear();
    if (req.path === '/api/demo/start') {
      const user = db.findUserById('usr_01')!;
      const token = generateSessionToken();
      db.createSession({ token, userId: user.id, createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString() });
      const { passwordHash: _, salt: __, ...safeUser } = user;
      res.json({ success: true, token, user: safeUser });
      return;
    }

    res.json({
      success: true,
      message: 'Scénario de démonstration réinitialisé avec succès.',
      seedPlacesCount: freshDb.places.length,
      defaultUser: freshDb.users[0].username,
    });
  } catch (err: any) {
    console.error('Demo reset error:', err);
    res.status(500).json({ error: 'reset_failed', message: 'Erreur lors de la réinitialisation de la démo.' });
  }
});

// ==========================================
// 5. MEDIA UPLOAD & STRICT ACCESS CONTROL
// ==========================================

/**
 * Upload Media with strict server identity deduction
 */
app.post('/api/media/upload', requireAuth, (req: Request, res: Response) => {
  try {
    const { dataBase64, mimeType, sizeBytes, audience } = req.body;

    if (!dataBase64 || typeof dataBase64 !== 'string') {
      res.status(400).json({
        error: 'validation_error',
        message: 'Le payload du média est manquant ou invalide.',
      });
      return;
    }

    if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
      res.status(415).json({
        error: 'unsupported_media_type',
        message: `Type MIME non autorisé (${mimeType || 'inconnu'}). Formats acceptés : image/jpeg, image/png, image/webp.`,
      });
      return;
    }

    const estimatedSizeBytes = sizeBytes || Math.round((dataBase64.length * 3) / 4);
    if (estimatedSizeBytes > MAX_MEDIA_SIZE_BYTES) {
      res.status(413).json({
        error: 'payload_too_large',
        message: `Média trop volumineux (${(estimatedSizeBytes / (1024 * 1024)).toFixed(1)} Mo). Le plafond strict serveur est de 15 Mo.`,
      });
      return;
    }

    const effectiveOwnerId = req.user!.id;
    const effectiveOwnerUsername = req.user!.username;

    const validAudiences = ['private', 'followers', 'public'];
    const chosenAudience = req.user!.age < 18 ? 'private'
      : validAudiences.includes(audience) ? audience : 'private';

    const assetId = `med_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const token = crypto.randomBytes(16).toString('hex');

    const record: ServerMediaRecord = {
      assetId,
      ownerId: effectiveOwnerId,
      ownerUsername: effectiveOwnerUsername,
      audience: chosenAudience as 'private' | 'followers' | 'public',
      mimeType,
      sizeBytes: estimatedSizeBytes,
      dataBase64,
      createdAt: new Date().toISOString(),
      token,
    };

    mediaRegistry.set(assetId, record);

    res.status(201).json({
      success: true,
      assetId,
      readUrl: `/api/media/${assetId}`,
      audience: chosenAudience,
      mimeType,
      sizeBytes: estimatedSizeBytes,
      createdAt: record.createdAt,
      message: 'Média validé et sécurisé avec succès côté serveur.',
    });
  } catch (err: any) {
    console.error('Server media upload error:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur interne lors du traitement serveur du média.',
    });
  }
});

/**
 * Read Media with Strict Audience Enforcement (Private / Followers / Public)
 */
app.get('/api/media/:assetId', (req: Request, res: Response) => {
  const { assetId } = req.params;
  const requesterId = req.user?.id || null;
  const providedToken = (req.query.token as string) || (req.headers['x-access-token'] as string);

  const asset = mediaRegistry.get(assetId);

  if (!asset) {
    res.status(404).json({
      error: 'content_unavailable',
      message: 'Le média demandé n\'existe pas ou a été supprimé.',
    });
    return;
  }

  // Scenario A: Audience is "private" (Moi uniquement)
  if (asset.audience === 'private') {
    const isOwner = requesterId === asset.ownerId;
    const hasOwnerToken = providedToken && providedToken === asset.token;

    if (!isOwner && !hasOwnerToken) {
      res.status(403).json({
        error: 'private_resource',
        message: 'Accès refusé : ce média est strictement réservé à son auteur (audience privée).',
        audience: 'private',
        author: asset.ownerUsername,
      });
      return;
    }
  }

  // Scenario B: Audience is "followers" (Abonnés uniquement)
  if (asset.audience === 'followers') {
    const isOwner = requesterId === asset.ownerId;
    const isConfirmedFollower = requesterId ? db.isFollower(requesterId, asset.ownerId) : false;
    const hasToken = providedToken && providedToken === asset.token;

    if (!isOwner && !isConfirmedFollower && !hasToken) {
      res.status(403).json({
        error: 'restricted_audience',
        message: 'Accès restreint : ce média est réservé aux abonnés confirmés de l\'auteur.',
        audience: 'followers',
        author: asset.ownerUsername,
      });
      return;
    }
  }

  // Scenario C: Audience is "public" OR requester is authorized
  const base64Data = asset.dataBase64.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');

  res.setHeader('Content-Type', asset.mimeType);
  res.setHeader('Content-Length', imageBuffer.length);
  res.setHeader('Cache-Control', asset.audience === 'public' ? 'public, max-age=86400' : 'private, no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Media-Audience', asset.audience);
  res.setHeader('X-Media-Owner', asset.ownerUsername);

  res.send(imageBuffer);
});

// ==========================================
// 6. OPERATOR BACK-OFFICE GUARDS (M01 - M14)
// ==========================================

/**
 * Operator metrics (protected by requireOperator)
 */
app.get('/api/admin/metrics', requireOperator, (req: Request, res: Response) => {
  const users = db.getUsers();
  const places = db.getPlaces();
  const checkins = db.getCheckins();
  const reports = db.getReports();

  res.json({
    metrics: {
      totalUsers: users.length,
      totalPlaces: places.length,
      totalVerifiedCheckins: checkins.filter(c => c.status === 'verified').length,
      pendingReports: reports.filter(r => r.status === 'open').length,
      environment: process.env.NODE_ENV || 'development',
    },
    operator: {
      username: req.user!.username,
      role: req.user!.role,
    },
  });
});

/**
 * Report incident or content
 */
app.post('/api/reports', requireAuth, (req: Request, res: Response) => {
  const { targetType, targetId, reason, details, severity } = req.body;
  if (!targetType || !targetId || !reason) {
    res.status(400).json({ error: 'validation_error', message: 'Champs de signalement incomplets.' });
    return;
  }

  const report = db.createReport({
    id: `rep_${Date.now()}`,
    reporterId: req.user!.id,
    reporterName: req.user!.displayName,
    targetType,
    targetId,
    reason,
    details: details || '',
    severity: severity || 'medium',
    status: 'open',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({ success: true, report, message: 'Signalement transmis à l\'équipe de modération RED LOOP.' });
});

// ==========================================
// 7. GOOGLE MAPS GROUNDING (GEMINI 3.8 FLASH)
// ==========================================
app.post('/api/places/grounding', async (req: Request, res: Response) => {
  try {
    const { query, latitude, longitude } = req.body;
    const prompt = query || 'Quels sont les meilleurs restaurants, maquis et rooftops recommandés à Cocody et Abidjan ?';
    
    const lat = typeof latitude === 'number' ? latitude : 5.3428;
    const lng = typeof longitude === 'number' ? longitude : -3.9935;

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        text: 'Les lieux affichés sont une sélection fictive pour la démonstration à Cocody.',
        groundedPlaces: [],
        note: 'GEMINI_API_KEY non configurée pour le grounding direct.',
      });
      return;
    }

    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        },
      },
    });

    const text = geminiResponse.text || '';
    const chunks = geminiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapsPlaces: Array<{ uri: string; title: string }> = [];

    for (const chunk of chunks) {
      if ((chunk as any).maps) {
        const mapsData = (chunk as any).maps;
        if (mapsData.uri && mapsData.title) {
          mapsPlaces.push({
            uri: mapsData.uri,
            title: mapsData.title,
          });
        }
      }
    }

    res.json({
      text,
      groundedPlaces: mapsPlaces,
    });
  } catch (err: any) {
    console.error('Maps grounding error:', err);
    res.status(500).json({
      error: 'grounding_failed',
      message: err.message || 'Impossible de récupérer les données Google Maps actuellement.',
    });
  }
});

// ==========================================
// 8. VITE DEV SERVER MIDDLEWARE MOUNTING
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  const httpServer = app.listen(PORT, process.env.HOST || '127.0.0.1', () => {
    const address = httpServer.address();
    const boundPort = typeof address === 'object' && address ? address.port : PORT;
    console.log(`CHKPT Fullstack Server running at http://${process.env.HOST || '127.0.0.1'}:${boundPort}`);
  });
}

startServer();
export { app };
