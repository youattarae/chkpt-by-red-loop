import {fileURLToPath} from 'node:url';
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

import { installBackupRoutes } from './server/backup';
import { installStoryRoutes, pruneStories } from './server/stories';
import {installDiscoveryRoutes} from './server/discovery';
import { installSocialRoutes } from './server/social';
import { publicBadgeSummaries, evaluateBadges, awardPublishedPhoto } from './server/badgeEngine';
import { getEventCatalog } from './server/events';
import { installRemoteAccess } from './server/remoteAccess';
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

if(process.env.CHKPT_REMOTE_ACCESS==='true'&&process.env.NODE_ENV!=='production')throw new Error('Remote demo requires NODE_ENV=production and compiled assets.');
const app = express();
app.disable('x-powered-by');
app.use((_req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');next();});
installRemoteAccess(app);
app.use('/api',(_req,res,next)=>{res.setHeader('Cache-Control','private, no-store');next();});
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase JSON body parser limit for base64 media payloads up to 20MB
app.use(express.json({ limit: '21mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Global authentication middleware to resolve session on every request
app.use(authenticateUser);
app.get('/api/demo/access-mode', (_req, res) => res.json({ remote: process.env.CHKPT_REMOTE_ACCESS === 'true' }));

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

const mediaRegistry = {
  get: (id:string) => db.getRawData().media.find(asset=>asset.assetId===id),
  set: (_id:string,record:ServerMediaRecord) => db.updateSharedData({media:[...db.getRawData().media.filter(asset=>asset.assetId!==record.assetId),record]}),
  clear: () => db.updateSharedData({media:[]}),
};
installSocialRoutes(app);
installDiscoveryRoutes(app);
installStoryRoutes(app);
installBackupRoutes(app);

// Allowed media types & limits
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']);
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
  const user = seedUserIds.has(username)?db.findUserById(username):db.findUserByUsername(username);
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
  res.json({ authenticated: true, user: safeUser, followingIds: db.getFollowing(req.user.id), badges:evaluateBadges(req.user.id).badges });
});

// Public profile metadata only: never expose age, roles, credentials or visit history.
app.get('/api/profiles/:id', requireAuth, (req: Request, res: Response) => {
  const user = db.findUserById(req.params.id as string);
  if (!user) { res.status(404).json({ error: 'profile_not_found' }); return; }
  const hidden = user.visibility === 'private' || user.age < 18;
  const profile = { id: user.id, displayName: user.displayName, username: user.username,
    avatarUrl: user.avatarUrl, visibility: hidden ? 'private' : 'public',
    ...(!hidden || req.user!.id === user.id ? { bio: user.bio, homeZone: user.homeZone, badges:publicBadgeSummaries(user.id), followersCount: user.followersCount, followingCount: user.followingCount } : {}) };
  res.json({ profile:{...profile,...(req.user!.id===user.id?{xpPoints:user.xpPoints}:{})}, following: db.isFollower(req.user!.id, user.id) });
});
app.post('/api/profiles/:id/follow', requireAuth, (req: Request, res: Response) => {
  const id = req.params.id as string;
  const target = db.findUserById(id);
  if (!target) { res.status(404).json({ error: 'profile_not_found' }); return; }
  if (id === req.user!.id || typeof req.body.following !== 'boolean') { res.status(400).json({ error: 'invalid_follow' }); return; }
  if (req.body.following && (target.visibility === 'private' || target.age < 18)) {
    res.status(403).json({ error: 'private_profile', message: 'Les demandes de suivi privé ne sont pas disponibles dans cette démonstration.' }); return;
  }
  if (req.body.following) db.followUser(req.user!.id, id);
  else db.unfollowUser(req.user!.id, id);
  res.json({ following: db.isFollower(req.user!.id, id), followingIds: db.getFollowing(req.user!.id),
    followersCount: target.followersCount, followingCount: db.findUserById(req.user!.id)!.followingCount });
});

app.get('/api/places/:id/reviews', (req: Request, res: Response) => {
  const placeId = req.params.id as string;
  if (!db.getPlaces().some(place => place.id === placeId)) { res.status(404).json({ error: 'place_not_found' }); return; }
  const reviews = db.getReviews(placeId).flatMap(review => {
    const author = db.findUserById(review.userId);
    if (!author || author.visibility === 'private' || author.age < 18) return [];
    return [{ id: review.id, userId: author.id, authorName: author.displayName, rating: review.rating, comment: review.comment, updatedAt: review.updatedAt }];
  });
  res.json({ reviews });
});
app.post('/api/places/:id/reviews', requireAuth, (req: Request, res: Response) => {
  const placeId = req.params.id as string;
  if (!db.getPlaces().some(place => place.id === placeId)) { res.status(404).json({ error: 'place_not_found' }); return; }
  if (req.user!.visibility === 'private' || req.user!.age < 18) { res.status(403).json({ error: 'private_profile', message: 'Les avis publics ne sont pas proposés pour les profils privés dans cette démo.' }); return; }
  const { rating, comment } = req.body;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || typeof comment !== 'string' || comment.trim().length < 3 || comment.trim().length > 1000) {
    res.status(400).json({ error: 'invalid_review', message: 'Choisissez de 1 à 5 étoiles et un commentaire de 3 à 1 000 caractères.' }); return;
  }
  db.saveReview(req.user!.id, placeId, rating, comment.trim());
  res.json({ success: true });
});

// ==========================================
// 2. CANONICAL PLACES API
// ==========================================

/**
 * Get all certified places in the official repository
 */
app.get('/api/events', (_req,res)=>res.json({events:getEventCatalog()}));
app.get('/api/badges',requireAuth,(req,res)=>res.json(evaluateBadges(req.user!.id)));
app.post('/api/badges/photo',requireAuth,(req,res)=>{
  const result=awardPublishedPhoto(req.user!.id,req.body.checkinId,req.body.mediaUrl);
  if(!result){res.status(403).json({error:'published_photo_proof_required'});return;}
  res.json(result);
});
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
      eventId: typeof req.body.eventId === 'string' ? req.body.eventId : undefined,
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
  // Personal history is owner-only, including public profiles and operator sessions.
  if (targetUserId !== req.user!.id) {
    res.status(403).json({ error: 'history_owner_only', message: 'Seul le propriétaire peut consulter son historique.' });
    return;
  }
  const checkins = db.getCheckins(req.user!.id);
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
    pruneStories();
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
        message: `Type MIME non autorisé (${mimeType || 'inconnu'}). Formats acceptés : JPEG, PNG, WebP, MP4, WebM.`,
      });
      return;
    }

    const match=/^data:((?:image\/(?:jpeg|png|webp)|video\/(?:mp4|webm)));base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataBase64);
    if(!match||match[1]!==mimeType){res.status(400).json({error:'invalid_media'});return;}
    const bytes = Buffer.from(match[2],'base64');
    if(mimeType==='video/mp4' && (bytes.length<12 || bytes.toString('ascii',4,8)!=='ftyp') || mimeType==='video/webm' && bytes.subarray(0,4).toString('hex')!=='1a45dfa3'){res.status(400).json({error:'invalid_video',message:'Vidéo MP4 ou WebM invalide.'});return;}
    const estimatedSizeBytes = bytes.length;
    if(db.getRawData().media.reduce((sum,asset)=>sum+asset.sizeBytes,0)+estimatedSizeBytes>50*1024*1024){res.status(413).json({error:'media_storage_full',message:'Le stockage de démonstration est plein (50 Mo). Contactez l’opérateur.'});return;}
    if (estimatedSizeBytes > MAX_MEDIA_SIZE_BYTES) {
      res.status(413).json({
        error: 'payload_too_large',
        message: `Média trop volumineux (${(estimatedSizeBytes / (1024 * 1024)).toFixed(1)} Mo). Le plafond strict serveur est de 15 Mo.`,
      });
      return;
    }

    const effectiveOwnerId = req.user!.id;
    const effectiveOwnerUsername = req.user!.username;

    // Drafts remain owner-only. The publication/story endpoint sets the final audience.
    const chosenAudience = 'private' as const;

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
app.delete('/api/media/:assetId',requireAuth,(req,res)=>{
  const data=db.getRawData();const asset=data.media.find(asset=>asset.assetId===req.params.assetId&&asset.ownerId===req.user!.id);
  if(!asset){res.status(404).json({error:'media_unavailable'});return;}
  const url='/api/media/'+asset.assetId;
  if(asset.storyId||data.posts.some(post=>post.mediaUrl===url||post.media?.some(item=>item.url===url))||data.users.some(user=>user.avatarUrl===url)){res.status(409).json({error:'media_in_use'});return;}
  db.updateSharedData({media:data.media.filter(item=>item.assetId!==asset.assetId)});res.json({success:true});
});

app.get('/api/media/:assetId', (req: Request, res: Response) => {
  const { assetId } = req.params;
  const requesterId = req.user?.id || null;

  const asset = mediaRegistry.get(assetId);

  if (!asset) {
    res.status(404).json({
      error: 'content_unavailable',
      message: 'Le média demandé n\'existe pas ou a été supprimé.',
    });
    return;
  }

  if(asset.storyId&&!req.user){res.status(401).json({error:'auth_required'});return;}
  if(asset.storyId&&!db.getRawData().stories.some(story=>story.id===asset.storyId&&Date.parse(story.expiresAt)>Date.now())){res.status(404).json({error:'story_expired'});return;}
  const owner=db.findUserById(asset.ownerId);
  if(!owner||((owner.visibility==='private'||owner.age<18)&&requesterId!==owner.id)){res.status(403).json({error:'private_resource'});return;}
  // Scenario A: Audience is "private" (Moi uniquement)
  if (asset.audience === 'private') {
    const isOwner = requesterId === asset.ownerId;

    if (!isOwner) {
      res.status(403).json({
        error: 'private_resource',
        message: 'Accès refusé : ce média est strictement réservé à son auteur (audience privée).',
        audience: 'private',
      });
      return;
    }
  }

  // Scenario B: Audience is "followers" (Abonnés uniquement)
  if (asset.audience === 'followers') {
    const isOwner = requesterId === asset.ownerId;
    const isConfirmedFollower = requesterId ? db.isFollower(requesterId, asset.ownerId) : false;

    if (!isOwner && !isConfirmedFollower) {
      res.status(403).json({
        error: 'restricted_audience',
        message: 'Accès restreint : ce média est réservé aux abonnés confirmés de l\'auteur.',
        audience: 'followers',
      });
      return;
    }
  }

  // Scenario C: Audience is "public" OR requester is authorized
  const base64Data = asset.dataBase64.slice(asset.dataBase64.indexOf(',')+1);
  const imageBuffer = Buffer.from(base64Data, 'base64');

  res.setHeader('Content-Type', asset.mimeType);
  res.setHeader('Content-Length', imageBuffer.length);
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

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

// Adult-only fictitious advertising asset; intentionally outside public/dist.
app.get('/api/ads/adult-image',requireAuth,(req,res)=>{
  if(req.user!.age<18){res.status(403).json({error:'adult_only'});return;}
  res.setHeader('Cache-Control','private, no-store');
  res.sendFile(fileURLToPath(new URL('./server/assets/pub-biere-demo.webp',import.meta.url)));
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
        available: false,
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
      message: 'Recherche externe indisponible. Réessayez plus tard.',
    });
  }
});

app.use('/api',(_req,res)=>{res.status(404).json({error:'not_found',message:'Ce service est indisponible.'});});

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
    // Defense in depth: source, private files and debugging maps are never public assets.
    app.use((req,res,next)=>{
      let requested:string;try{requested=decodeURIComponent(req.path);}catch{res.status(400).end();return;}
      if(/(?:^|\/)(?:\.[^/]+|src|server|shared|scripts|tests|docs|node_modules|@vite|@fs)(?:\/|$)/i.test(requested)||/\.(?:map|ts|tsx|md)$/i.test(requested)||/(?:^|\/)(?:package(?:-lock)?\.json|tsconfig\.json)$/i.test(requested)){res.status(404).end();return;}
      next();
    });
    app.use(express.static('dist',{dotfiles:'deny'}));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.use((error:any,_req:Request,res:Response,next:import('express').NextFunction)=>{
    if(res.headersSent){next(error);return;}
    const status=error?.status===413?413:error?.status===400?400:500;
    console.error('Request failed:',status,error?.name||'Error');
    res.status(status).json({error:status===413?'payload_too_large':status===400?'invalid_request':'server_error',message:status===413?'Le fichier ou la demande dépasse la taille autorisée.':status===400?'La demande est invalide.':'Une erreur est survenue. Réessayez.'});
  });

  const httpServer = app.listen(PORT, process.env.HOST || '127.0.0.1', () => {
    const address = httpServer.address();
    const boundPort = typeof address === 'object' && address ? address.port : PORT;
    console.log(`CHKPT Fullstack Server running at http://${process.env.HOST || '127.0.0.1'}:${boundPort}`);
  });
}

startServer();
export { app };
