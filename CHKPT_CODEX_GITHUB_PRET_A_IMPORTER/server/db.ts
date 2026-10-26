/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT & RED LOOP — Persistent File-Backed Database Engine
 * Provides transactional file-backed persistence for users, places,
 * check-ins, isolated proofs, points ledger, follows, and reports.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { demoAdminPassword, privateDemoEnabled, seedUserIds } from './demoConfig';

function hashSeedPassword(pwd: string, salt: string): string {
  return crypto.scryptSync(pwd, salt, 64).toString('hex');
}

export interface UserEntity {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  salt: string;
  age: number;
  visibility: 'public' | 'private';
  role: 'user' | 'creator' | 'pro' | 'moderator' | 'admin' | 'superadmin';
  homeZone: string;
  avatarUrl: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  checkinsCount: number;
  xpPoints: number;
  level: number;
  createdAt: string;
}

export interface SessionEntity {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceEntity {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  commune: string;
  neighborhood: string;
  address: string;
  coordinates: Coordinates;
  verificationStatus: 'verified' | 'unverified' | 'pending';
  claimStatus: 'unclaimed' | 'pending' | 'approved' | 'rejected';
  exploitationStatus: 'open' | 'temporarily_closed' | 'permanently_closed';
  priceLevel: '€' | '€€' | '€€€';
  priceDescription: string;
  coverImage: string;
  tags: string[];
  isCertified: boolean;
}

export interface CheckInEntity {
  isSimulated?: boolean;
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  placeId: string;
  placeName: string;
  placeCategory: string;
  timestamp: string;
  status: 'verified' | 'pending_validation' | 'rejected';
  audience: 'private' | 'followers' | 'public';
  rejectionReason?: string;
  awardedXp: number;
  idempotencyKey: string;
  createdAt: string;
}

export interface CheckInProofEntity {
  id: string;
  checkinId: string;
  userId: string;
  placeId: string;
  reportedLat: number;
  reportedLng: number;
  accuracyMeters: number;
  calculatedDistanceMeters: number;
  isSimulated: boolean;
  timestamp: string;
  createdAt: string;
}

export interface PointsLedgerEntity {
  id: string;
  userId: string;
  amount: number;
  sourceAction: string;
  referenceId: string;
  timestamp: string;
}

export interface FollowEntity {
  id: string;
  followerId: string;
  followedId: string;
  createdAt: string;
}

export interface ReportEntity {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'post' | 'comment' | 'place' | 'user';
  targetId: string;
  reason: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface DatabaseSchema {
  users: UserEntity[];
  sessions: SessionEntity[];
  places: PlaceEntity[];
  checkins: CheckInEntity[];
  checkin_proofs: CheckInProofEntity[];
  points_ledger: PointsLedgerEntity[];
  follows: FollowEntity[];
  reports: ReportEntity[];
  version: number;
}

const DB_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'chkpt_db.json');

// Canonical certified places for Abidjan (Shared front-end & back-end)
export const CANONICAL_PLACES: PlaceEntity[] = [
  {
    id: 'plc_cocody_lounge',
    name: 'Lagon Bleu Rooftop Lounge',
    category: 'bars_lounges',
    categoryLabel: 'Bar & Lounge',
    description: 'Rooftop panoramique élégant perché face à la lagune Ébrié à Cocody Danga. Ambiance tamisée, cocktails signature et tapas ivoiriennes.',
    commune: 'Cocody',
    neighborhood: 'Danga',
    address: 'Rue des Jardins, Cocody Danga, Abidjan',
    coordinates: { lat: 5.3428, lng: -3.9935 },
    verificationStatus: 'verified',
    claimStatus: 'approved',
    exploitationStatus: 'open',
    priceLevel: '€€€',
    priceDescription: '7 000 – 18 000 FCFA',
    coverImage: '/illustrations/rooftop.svg',
    tags: ['Rooftop', 'Vue Lagune', 'Cocktails', 'Sunset', 'Classy Street'],
    isCertified: true,
  },
  {
    id: 'plc_maquis_etoile',
    name: "Maquis L'Étoile d'Abidjan",
    category: 'maquis',
    categoryLabel: 'Maquis & Grillades',
    description: "Le repère incontournable pour les amateurs de carpes braisées dorées, kédjénou de pintade et alloco croustillant.",
    commune: 'Cocody',
    neighborhood: 'Saint-Jean',
    address: 'Boulevard Saint-Jean, face Cité Universitaire, Cocody',
    coordinates: { lat: 5.3491, lng: -4.0012 },
    verificationStatus: 'verified',
    claimStatus: 'approved',
    exploitationStatus: 'open',
    priceLevel: '€€',
    priceDescription: '3 500 – 9 000 FCFA',
    coverImage: '/illustrations/maquis.svg',
    tags: ['Poisson braisé', 'Alloco', 'Attiéké', 'Convivial', 'Musique live'],
    isCertified: true,
  },
  {
    id: 'plc_cafe_atelier',
    name: "L'Atelier Café & Bakery",
    category: 'cafes_boulangeries',
    categoryLabel: 'Café & Pâtisserie',
    description: "Coffee shop artisanal et boulangerie chic à la Riviera. Torréfaction de fèves robusta ivoiriennes d'exception et viennoiseries pur beurre.",
    commune: 'Cocody',
    neighborhood: 'Riviera 3',
    address: 'Carrefour Jacques Prévert, Riviera 3, Cocody',
    coordinates: { lat: 5.3615, lng: -3.9688 },
    verificationStatus: 'verified',
    claimStatus: 'unclaimed',
    exploitationStatus: 'open',
    priceLevel: '€€',
    priceDescription: '2 500 – 6 500 FCFA',
    coverImage: '/illustrations/cafe.svg',
    tags: ['Spécialité Café', 'Brunch', 'Pâtisseries', 'Coworking calme'],
    isCertified: true,
  },
  {
    id: 'plc_galerie_ceci',
    name: "Centre d'Art Urbain & Céramique Babi",
    category: 'culture_art',
    categoryLabel: 'Art & Culture',
    description: "Espace d'exposition alternatif dédié aux sculpteurs, peintres et créateurs contemporains ivoiriens. Ateliers et vernissages réguliers.",
    commune: 'Cocody',
    neighborhood: 'Deux-Plateaux Vallons',
    address: 'Rue des Jardins, Vallons, Cocody',
    coordinates: { lat: 5.3582, lng: -3.9984 },
    verificationStatus: 'verified',
    claimStatus: 'unclaimed',
    exploitationStatus: 'open',
    priceLevel: '€',
    priceDescription: '1 000 – 3 000 FCFA',
    coverImage: '/illustrations/art.svg',
    tags: ['Exposition', 'Art Contemporain', 'Design', 'Vernissage'],
    isCertified: true,
  },
  {
    id: 'plc_chez_ambroise',
    name: 'Chez Ambroise Maquis VIP',
    category: 'maquis',
    categoryLabel: 'Maquis & Grillades',
    description: 'Institution historique de la nuit abidjanaise. Poulet bicyclette au feu de bois, ambiance festive et rencontres culturelles animées.',
    commune: 'Marcory',
    neighborhood: 'Zone 4C',
    address: 'Rue Paul Langevin, Zone 4C, Marcory',
    coordinates: { lat: 5.2912, lng: -3.9841 },
    verificationStatus: 'unverified',
    claimStatus: 'unclaimed',
    exploitationStatus: 'open',
    priceLevel: '€€',
    priceDescription: '4 000 – 12 000 FCFA',
    coverImage: '/illustrations/maquis.svg',
    tags: ['Plein air', 'Ambiance Nuit', 'Lieu Historique', 'Grillades'],
    isCertified: false,
  },
  {
    id: 'plc_toit_plateau',
    name: 'Le Toit des Affaires',
    category: 'restaurants',
    categoryLabel: 'Restaurant Bistronomique',
    description: 'Haute gastronomie fusion franco-ivoirienne avec vue imprenable sur le pont Alassane Ouattara et le Plateau illuminé.',
    commune: 'Plateau',
    neighborhood: 'Centre des Affaires',
    address: 'Avenue Chardy, Immeuble Horizon 12e étage, Plateau',
    coordinates: { lat: 5.3235, lng: -4.0189 },
    verificationStatus: 'verified',
    claimStatus: 'pending',
    exploitationStatus: 'open',
    priceLevel: '€€€',
    priceDescription: '15 000 – 35 000 FCFA',
    coverImage: '/illustrations/maquis.svg',
    tags: ['Bistronomie', 'Vue Pont', 'Dîner Romantique', 'Cave à vin'],
    isCertified: true,
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private getFreshSeedState(): DatabaseSchema {
    return {
      users: [
        {
          id: 'usr_01',
          username: 'koffi_urbex',
          displayName: 'Koffi Kouamé',
          passwordHash: hashSeedPassword(crypto.randomBytes(32).toString('hex'), 'chkpt_salt_koffi_demo'),
          salt: 'chkpt_salt_koffi_demo',
          age: 24,
          visibility: 'public',
          role: 'user',
          homeZone: 'Cocody, Abidjan',
          avatarUrl: '/illustrations/koffi.svg',
          bio: 'Explorateur d\'Abidjan · Foodie & rooftop chill · Cocody en priorité',
          followersCount: 389,
          followingCount: 142,
          checkinsCount: 18,
          xpPoints: 1240,
          level: 4,
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        },
        {
          id: 'usr_sarah',
          username: 'sarah_dlo',
          displayName: 'Sarah Diallo',
          passwordHash: hashSeedPassword(crypto.randomBytes(32).toString('hex'), 'chkpt_salt_sarah_demo'),
          salt: 'chkpt_salt_sarah_demo',
          age: 23,
          visibility: 'public',
          role: 'user',
          homeZone: 'Cocody, Abidjan',
          avatarUrl: '/illustrations/sarah.svg',
          bio: 'Foodie & sorties branchées entre Cocody et le Plateau.',
          followersCount: 512,
          followingCount: 220,
          checkinsCount: 26,
          xpPoints: 1820,
          level: 6,
          createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        },
        {
          id: 'usr_admin',
          username: 'redloop_admin',
          displayName: 'Superviseur RED LOOP',
          passwordHash: hashSeedPassword(privateDemoEnabled ? demoAdminPassword! : crypto.randomBytes(32).toString('hex'), 'chkpt_salt_admin_demo'),
          salt: 'chkpt_salt_admin_demo',
          age: 35,
          visibility: 'private',
          role: 'admin',
          homeZone: 'Abidjan Siège',
          avatarUrl: '/illustrations/admin.svg',
          bio: 'Compte administrateur RED LOOP pour la gestion opérationnelle et modération.',
          followersCount: 0,
          followingCount: 0,
          checkinsCount: 0,
          xpPoints: 3000,
          level: 10,
          createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
        },
      ],
      sessions: [],
      places: CANONICAL_PLACES,
      checkins: [
        {
          id: 'chk_demo_initial',
          userId: 'usr_01',
          userName: 'Koffi Kouamé',
          userAvatar: '/illustrations/koffi.svg',
          placeId: 'plc_cocody_lounge',
          placeName: 'Lagon Bleu Rooftop Lounge',
          placeCategory: 'bars_lounges',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'verified',
          audience: 'public',
          awardedXp: 50,
          idempotencyKey: 'chk_usr_01_plc_cocody_lounge_initial_seed',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      checkin_proofs: [
        {
          id: 'prf_demo_initial',
          checkinId: 'chk_demo_initial',
          userId: 'usr_01',
          placeId: 'plc_cocody_lounge',
          reportedLat: 5.3428,
          reportedLng: -3.9935,
          accuracyMeters: 12,
          calculatedDistanceMeters: 0,
          isSimulated: false,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      points_ledger: [
        {
          id: 'pts_demo_initial',
          userId: 'usr_01',
          amount: 50,
          sourceAction: 'CHECKIN_VERIFIED',
          referenceId: 'chk_demo_initial',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      follows: [
        {
          id: 'flw_1',
          followerId: 'usr_sarah',
          followedId: 'usr_01',
          createdAt: new Date().toISOString(),
        },
      ],
      reports: [],
      version: 2,
    };
  }

  private load(): DatabaseSchema {
    this.ensureDirectory();

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const tables = ['users', 'sessions', 'places', 'checkins', 'checkin_proofs', 'points_ledger', 'follows', 'reports'];
        if (!tables.every(table => Array.isArray(parsed[table]))) throw new Error('Invalid database tables');
        parsed.places = CANONICAL_PLACES;
        // Migrate old snapshots: revoke seed sessions and replace predictable passwords.
        for (const user of parsed.users) {
          if (!seedUserIds.has(user.id)) continue;
          user.salt = crypto.randomBytes(16).toString('hex');
          const password = privateDemoEnabled && user.id === 'usr_admin'
            ? demoAdminPassword! : crypto.randomBytes(32).toString('hex');
          user.passwordHash = hashSeedPassword(password, user.salt);
        }
        parsed.sessions = parsed.sessions.filter((session: SessionEntity) => !seedUserIds.has(session.userId));
        this.save(parsed);
        return parsed;
      } catch (e) {
        throw new Error('Base locale illisible : démarrage interrompu pour préserver le fichier existant.', { cause: e });
      }
    }

    const initialDb = this.getFreshSeedState();
    this.save(initialDb);
    return initialDb;
  }

  public resetPitchDemoState(): DatabaseSchema {
    this.data = this.getFreshSeedState();
    this.save();
    return this.data;
  }

  private save(dataToSave?: DatabaseSchema) {
    this.ensureDirectory();
    const data = dataToSave || this.data;
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public getRawData(): DatabaseSchema {
    return this.data;
  }

  public getUsers(): UserEntity[] {
    return this.data.users;
  }

  public findUserById(id: string): UserEntity | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByUsername(username: string): UserEntity | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public createUser(user: UserEntity): UserEntity {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<UserEntity>): UserEntity | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  public createSession(session: SessionEntity): SessionEntity {
    this.data.sessions.push(session);
    this.save();
    return session;
  }

  public findSession(token: string): SessionEntity | undefined {
    const s = this.data.sessions.find(session => session.token === token);
    if (!s) return undefined;
    const expiry = new Date(s.expiresAt).getTime();
    if (!Number.isFinite(expiry) || expiry <= Date.now()) {
      this.deleteSession(token);
      return undefined;
    }
    return s;
  }

  public deleteSession(token: string): void {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  public getPlaces(): PlaceEntity[] {
    return this.data.places;
  }

  public findPlaceById(id: string): PlaceEntity | undefined {
    return this.data.places.find(p => p.id === id);
  }

  public getCheckins(userId?: string): CheckInEntity[] {
    if (userId) {
      return this.data.checkins.filter(c => c.userId === userId);
    }
    return this.data.checkins;
  }

  public findCheckinById(id: string): CheckInEntity | undefined {
    return this.data.checkins.find(c => c.id === id);
  }

  public findCheckinByIdempotency(idempotencyKey: string): CheckInEntity | undefined {
    return this.data.checkins.find(c => c.idempotencyKey === idempotencyKey);
  }

  public createCheckin(checkin: CheckInEntity, proof: CheckInProofEntity, awardedXp: number): CheckInEntity {
    this.data.checkins.unshift(checkin);
    this.data.checkin_proofs.push(proof);

    if (awardedXp > 0) {
      const user = this.findUserById(checkin.userId);
      if (user) {
        user.xpPoints += awardedXp;
        user.checkinsCount += 1;
        user.level = Math.floor(user.xpPoints / 300) + 1;
      }

      this.data.points_ledger.push({
        id: `pts_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: checkin.userId,
        amount: awardedXp,
        sourceAction: 'CHECKIN_VERIFIED',
        referenceId: checkin.id,
        timestamp: new Date().toISOString(),
      });
    }

    this.save();
    return checkin;
  }

  public getFollowers(userId: string): string[] {
    return this.data.follows
      .filter(f => f.followedId === userId)
      .map(f => f.followerId);
  }

  public getFollowing(userId: string): string[] {
    return this.data.follows.filter(f => f.followerId === userId).map(f => f.followedId);
  }

  public isFollower(followerId: string, followedId: string): boolean {
    return this.data.follows.some(f => f.followerId === followerId && f.followedId === followedId);
  }

  public followUser(followerId: string, followedId: string): boolean {
    if (this.isFollower(followerId, followedId)) return false;
    this.data.follows.push({
      id: `flw_${Date.now()}`,
      followerId,
      followedId,
      createdAt: new Date().toISOString(),
    });
    const followed = this.findUserById(followedId);
    if (followed) followed.followersCount += 1;
    const follower = this.findUserById(followerId);
    if (follower) follower.followingCount += 1;
    this.save();
    return true;
  }

  public createReport(report: ReportEntity): ReportEntity {
    this.data.reports.unshift(report);
    this.save();
    return report;
  }

  public getReports(): ReportEntity[] {
    return this.data.reports;
  }
}

export const db = new Database();
