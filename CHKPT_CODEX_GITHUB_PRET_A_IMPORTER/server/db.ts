import {isPresentationStory} from '../shared/storyLifetime';
import type {PlaceSource,PlaceProposal} from '../shared/placeSources';
import {validRef} from '../shared/entities';
import type {EntityRef,Activity,SavedContent} from '../shared/entities';
import {DEMO_PROFILES} from '../src/data/demoProfiles';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT & RED LOOP — Persistent File-Backed Database Engine
 * Provides transactional file-backed persistence for users, places,
 * check-ins, isolated proofs, points ledger, follows, and reports.
 */

import { INITIAL_POSTS } from '../src/data/mockData';
import type { Post } from '../src/types';
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
  profileBadgeIds?:string[];
  blockedUserIds?:string[];
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
  exploitationStatus: 'open' | 'temporarily_closed' | 'permanently_closed' | 'unknown';
  priceLevel?: '€' | '€€' | '€€€';
  priceDescription: string;
  coverImage: string;
  tags: string[];
  isCertified: boolean;
  markerKind?:string;
  isSponsored?:boolean;
  isDemo?:boolean;
  mergedInto?:string;
  localOverrides?:string[];
  verificationDecision?:'rejected';
}

export interface CheckInEntity {
  isSimulated?: boolean;
  manualReviewReason?:string;
  eligibility?:{version:1;placeCoordinates:Coordinates;event?:{id:string;placeId:string;startsAt:string;endsAt:string}};
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

export interface ReviewEntity {
  id: string; placeId: string; userId: string; superseded?:boolean; originalPlaceId?:string; rating: number; comment: string; updatedAt: string;
}
export interface StoredPost extends Post { likedBy: string[]; baseLikesCount: number; baseCommentsCount: number }
export interface StoryEntity { id:string;authorId:string;mediaUrl:string;mediaType:'image'|'video';text:string;audience:'public'|'followers'|'private';createdAt:string;expiresAt:string;isDemo?:boolean }
export interface StoredMedia { storyId?:string; assetId:string; ownerId:string; ownerUsername:string; audience:'private'|'followers'|'public'; mimeType:string; sizeBytes:number; dataBase64:string; createdAt:string; token:string }
export interface SavedPlace { userId:string; placeId:string }
function seedPosts():StoredPost[]{return INITIAL_POSTS.map(post=>({...post,likedBy:post.isLikedByCurrentUser?['usr_01']:[],baseLikesCount:Math.max(0,post.likesCount-(post.isLikedByCurrentUser?1:0)),baseCommentsCount:Math.max(0,post.commentsCount-post.comments.length)}));}

export interface DirectMessage {id:string;senderId:string;recipientId:string;text:string;createdAt:string;readAt?:string;entity?:EntityRef;isDemo?:boolean}
export interface DatabaseSchema {
  messages: DirectMessage[];
  saved_content: SavedContent[];
  activity: Activity[];
  stories: StoryEntity[];
  posts: StoredPost[];
  saved_places: SavedPlace[];
  media: StoredMedia[];
  reviews: ReviewEntity[];
  users: UserEntity[];
  sessions: SessionEntity[];
  places: PlaceEntity[];
  checkins: CheckInEntity[];
  checkin_proofs: CheckInProofEntity[];
  points_ledger: PointsLedgerEntity[];
  follows: FollowEntity[];
  reports: ReportEntity[];
  version: number;
  demoUxVersion?:number;
  demoStorySeedVersion?:number;
  mapDemoVersion?:number;
  place_sources?:PlaceSource[];
  place_proposals?:PlaceProposal[];
  placesRevision?:number;
}

function validateUxTables(value:Partial<DatabaseSchema>){
 if(value.place_sources!==undefined&&(!Array.isArray(value.place_sources)||value.place_sources.some(s=>!s||typeof s.key!=='string'||typeof s.placeId!=='string'||!['OSM','fixture'].includes(s.provider)||!['node','way','relation'].includes(s.objectType)||typeof s.license!=='string'||!Number.isFinite(Date.parse(s.importedAt))||!s.lastValues||!Number.isFinite(s.lastValues.coordinates?.lat)||!Number.isFinite(s.lastValues.coordinates?.lng))))throw new Error('Invalid place sources');
 if(value.place_proposals!==undefined&&(!Array.isArray(value.place_proposals)||value.place_proposals.some(p=>!p||typeof p.id!=='string'||typeof p.userId!=='string'||!Array.isArray(p.candidates)||!['pending','approved','rejected'].includes(p.status))))throw new Error('Invalid place proposals');
 if(value.placesRevision!==undefined&&(!Number.isSafeInteger(value.placesRevision)||value.placesRevision<0))throw new Error('Invalid places revision');
 if(value.places&&(!Array.isArray(value.places)||value.places.some(p=>!p||typeof p.id!=='string'||typeof p.name!=='string'||!p.coordinates||!Number.isFinite(p.coordinates.lat)||!Number.isFinite(p.coordinates.lng)||Math.abs(p.coordinates.lat)>90||Math.abs(p.coordinates.lng)>180)))throw new Error('Invalid places');
 if(value.users?.some(u=>u.profileBadgeIds!==undefined&&(!Array.isArray(u.profileBadgeIds)||u.profileBadgeIds.length>3||u.profileBadgeIds.some(id=>typeof id!=='string'))||u.blockedUserIds!==undefined&&(!Array.isArray(u.blockedUserIds)||u.blockedUserIds.some(id=>typeof id!=='string'))))throw new Error('Invalid user preferences');
 if(value.messages!==undefined&&(!Array.isArray(value.messages)||value.messages.some(m=>!m||typeof m.id!=='string'||typeof m.senderId!=='string'||typeof m.recipientId!=='string'||typeof m.text!=='string'||m.text.length>2000||!Number.isFinite(Date.parse(m.createdAt))||m.entity!==undefined&&!validRef(m.entity))))throw new Error('Invalid messages');
 if(value.saved_content!==undefined&&(!Array.isArray(value.saved_content)||value.saved_content.some(item=>!item||typeof item.userId!=='string'||typeof item.id!=='string'||!['post','event'].includes(item.type))))throw new Error('Invalid saved content');
 if(value.activity!==undefined&&(!Array.isArray(value.activity)||value.activity.some(item=>!item||typeof item.id!=='string'||typeof item.recipientId!=='string'||typeof item.title!=='string'||typeof item.body!=='string'||!Number.isFinite(Date.parse(item.createdAt))||!['post','event','place','user','badge'].includes(item.targetType))))throw new Error('Invalid activity');
}

const DB_DIR = path.resolve(process.env.CHKPT_DATA_DIR || path.join(process.cwd(), '.data'));
export const databaseDirectory = DB_DIR;
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

function creatorDemoProfile(): UserEntity {
  const salt = crypto.randomBytes(16).toString('hex');
  return { id: 'usr_02', username: 'georges_armand', displayName: 'Georges Armand', salt,
    passwordHash: hashSeedPassword(crypto.randomBytes(32).toString('hex'), salt),
    age: 25, visibility: 'public', role: 'creator', homeZone: 'Cocody, Abidjan',
    avatarUrl: '/illustrations/admin.svg', bio: 'Art, culture et découvertes à Abidjan · profil fictif.',
    followersCount: 0, followingCount: 0, checkinsCount: 0, xpPoints: 0, level: 1,
    createdAt: new Date().toISOString() };
}

function fourthDemoProfile(users:UserEntity[]=[]):UserEntity{
 const profile=DEMO_PROFILES.find(profile=>profile.id==='usr_nadia')!;const salt=crypto.randomBytes(16).toString('hex');
 let username=profile.username;let suffix=0;while(users.some(user=>user.username===username))username=profile.username+'_demo'+(++suffix);
 return {...profile,username,salt,passwordHash:hashSeedPassword(crypto.randomBytes(32).toString('hex'),salt),age:29,visibility:'public',role:'user',followersCount:0,followingCount:0,checkinsCount:0,xpPoints:0,level:1,createdAt:new Date().toISOString()};
}
function enrichDemoProfiles(users:UserEntity[]){
 const previousIngrid=users.find(u=>u.id==='usr_sarah'&&u.displayName==='Ingrid N’Goan');if(previousIngrid)previousIngrid.displayName='Bintou Essehi';
 const legacy:{[id:string]:{username:string;name:string}}={usr_01:{username:'koffi_urbex',name:'Koffi Kouamé'},usr_sarah:{username:'sarah_dlo',name:'Sarah Diallo'},usr_02:{username:'amara_sound',name:'Amara Koné'}};
 for(const profile of DEMO_PROFILES){const previous=legacy[profile.id];if(!previous)continue;const user=users.find(user=>user.id===profile.id&&user.username===previous.username);if(user){let username=profile.username;let suffix=0;while(users.some(other=>other.id!==user.id&&other.username===username))username=profile.username+'_demo'+(++suffix);user.username=username;if(user.displayName===previous.name)user.displayName=profile.displayName;}}
 const oldAvatars=new Set(['/illustrations/koffi.svg','/illustrations/sarah.svg','/illustrations/admin.svg']);
 const oldBios=new Set(["Explorateur d'Abidjan · Foodie & rooftop chill · Cocody en priorité",'Foodie & sorties branchées entre Cocody et le Plateau.','Art, culture et découvertes à Abidjan · profil fictif.']);
 for(const profile of DEMO_PROFILES){const user=users.find(user=>user.id===profile.id);if(!user)continue;if(oldAvatars.has(user.avatarUrl))user.avatarUrl=profile.avatarUrl;if(oldBios.has(user.bio))user.bio=profile.bio;}
 return users;
}

class Database {
  private data: DatabaseSchema;
  private transactionDepth=0;
  public transaction<T>(action:()=>T):T{
    const before=structuredClone(this.data),outer=this.transactionDepth===0;this.transactionDepth++;
    try{const result=action();this.transactionDepth--;if(outer)this.save();return result;}catch(error){this.transactionDepth=outer?0:Math.max(0,this.transactionDepth-1);this.data=before;throw error;}
  }
  public touchPlaces(){this.data.placesRevision=(this.data.placesRevision||0)+1;this.save();}

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
      users: enrichDemoProfiles([
        {
          id: 'usr_01',
          username: 'yacoub_ouattara',
          displayName: 'Yacoub Ouattara',
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
          username: 'ingrid_ngoan',
          displayName: 'Bintou Essehi',
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
          displayName: 'Ingrid N’Goan',
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
        creatorDemoProfile(),fourthDemoProfile(),
      ]),
      sessions: [],
      places: structuredClone(CANONICAL_PLACES),
      checkins: [
        {
          id: 'chk_demo_initial',
          userId: 'usr_01',
          userName: 'Yacoub Ouattara',
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
      saved_content: [],
      activity: privateDemoEnabled ? [{id:'demo_activity_like',recipientId:'usr_01',title:'J’aime · démonstration',body:'Bintou aime votre découverte fictive.',targetType:'place',targetId:'plc_maquis_etoile',createdAt:new Date().toISOString(),isDemo:true},{id:'demo_activity_comment',recipientId:'usr_01',title:'Commentaire · démonstration',body:'Georges : une adresse à découvrir !',targetType:'place',targetId:'plc_cocody_lounge',createdAt:new Date().toISOString(),isDemo:true}] : [],
      messages: [],
      stories: [],
      posts: seedPosts(),
      saved_places: [{userId:'usr_01',placeId:'plc_cocody_lounge'}],
      media: [],
      reviews: [],
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
        if (parsed.reviews !== undefined && !Array.isArray(parsed.reviews)) throw new Error('Invalid reviews table');
        parsed.reviews ??= [];
        for(const table of ['saved_content','activity','messages','stories','posts','saved_places','media']) if(parsed[table]!==undefined&&!Array.isArray(parsed[table])) throw new Error('Invalid shared data table');
        parsed.saved_content ??= [];
        parsed.activity ??= [];
        parsed.messages ??= [];
        parsed.place_sources ??= [];parsed.place_proposals ??= [];
        validateUxTables(parsed);
        parsed.stories ??= [];
        parsed.posts ??= seedPosts();
        // Enrich only untouched demo illustrations, preserving personal posts and reactions.
        parsed.posts = parsed.posts.map((post:StoredPost)=>{
          const seed=INITIAL_POSTS.find(seed=>seed.id===post.id&&seed.authorId===post.authorId&&seed.text===post.text&&seed.mediaUrl===post.mediaUrl);
          return seed?.media?.length&&!post.media?.length?{...post,media:seed.media}:post;
        });
        parsed.saved_places ??= [{userId:'usr_01',placeId:'plc_cocody_lounge'}];
        parsed.media ??= [];
        if(new Set(parsed.places.map((p:PlaceEntity)=>p.id)).size!==parsed.places.length)throw new Error('Duplicate place IDs');
        // Preserve canonical IDs, imported places and validated local corrections on restart.
        const stored=new Map<string,PlaceEntity>(parsed.places.map((p:PlaceEntity)=>[p.id,p]));
        parsed.places=[...CANONICAL_PLACES.map(seed=>({...seed,...stored.get(seed.id)})),...parsed.places.filter((p:PlaceEntity)=>!CANONICAL_PLACES.some(seed=>seed.id===p.id))];
        if (!parsed.users.some((user: UserEntity) => user.id === 'usr_02' || user.username === 'georges_armand')) parsed.users.push(creatorDemoProfile());
        if(!parsed.users.some((user:UserEntity)=>user.id==='usr_nadia'))parsed.users.push(fourthDemoProfile(parsed.users));
        enrichDemoProfiles(parsed.users);
        const seeds=seedPosts().filter(post=>parsed.users.some((user:UserEntity)=>user.id===post.authorId)).map(post=>({...post,authorUsername:parsed.users.find((user:UserEntity)=>user.id===post.authorId).username}));
        const seedIds=new Set(seeds.map(post=>post.id));const existingPosts=new Map<string,StoredPost>(parsed.posts.map((post:StoredPost)=>[post.id,post]));
        parsed.posts=[...parsed.posts.filter((post:StoredPost)=>!seedIds.has(post.id)),...seeds.map(seed=>{
          const existing=existingPosts.get(seed.id);if(!existing)return seed;
          const profile=DEMO_PROFILES.find(profile=>profile.id===existing.authorId);
          if(profile){existing.authorName=profile.displayName;existing.authorUsername=parsed.users.find((user:UserEntity)=>user.id===existing.authorId).username;}
          const old=['/illustrations/koffi.svg','/illustrations/sarah.svg','/illustrations/admin.svg'];
          return profile&&old.includes(existing.authorAvatar)?{...existing,authorAvatar:profile.avatarUrl}:existing;
        })];
        parsed.media=parsed.media.map((asset:StoredMedia)=>{
          const url='/api/media/'+asset.assetId;
          const linked=asset.storyId||parsed.posts.some((post:StoredPost)=>post.mediaUrl===url||post.media?.some(item=>item.url===url))||parsed.users.some((user:UserEntity)=>user.avatarUrl===url);
          return linked?asset:{...asset,audience:'private'};
        });
        const likeFixture=parsed.activity.find((a:any)=>a.id==='demo_activity_like'&&a.isDemo&&a.body==='Ingrid aime votre découverte fictive.');if(likeFixture)likeFixture.body='Bintou aime votre découverte fictive.';
        const supervisor=parsed.users.find((u:UserEntity)=>u.id==='usr_admin');
        if(supervisor&&supervisor.displayName==='Superviseur RED LOOP')supervisor.displayName='Ingrid N’Goan';
        for(const post of parsed.posts){const author=parsed.users.find((u:UserEntity)=>u.id===post.authorId);if(author&&['usr_admin','usr_sarah'].includes(author.id))post.authorName=author.displayName;}
        // Migrate old snapshots: revoke seed sessions and replace predictable passwords.
        for (const user of parsed.users) {
          if (!seedUserIds.has(user.id)) continue;
          user.salt = crypto.randomBytes(16).toString('hex');
          const password = privateDemoEnabled && user.id === 'usr_admin'
            ? demoAdminPassword! : crypto.randomBytes(32).toString('hex');
          user.passwordHash = hashSeedPassword(password, user.salt);
        }
        parsed.sessions = parsed.sessions.filter((session: SessionEntity) => !seedUserIds.has(session.userId));
        this.addUxDemoFixtures(parsed);
        this.addDemoStoryFixtures(parsed);
        this.addNov9DemoPlaces(parsed);
        this.save(parsed);
        return parsed;
      } catch (e) {
        throw new Error('Base locale illisible : démarrage interrompu pour préserver le fichier existant.', { cause: e });
      }
    }

    const initialDb = this.getFreshSeedState();
    this.addUxDemoFixtures(initialDb);
    this.addDemoStoryFixtures(initialDb);
    this.addNov9DemoPlaces(initialDb);
    this.save(initialDb);
    return initialDb;
  }

  public resetPitchDemoState(): DatabaseSchema {
    this.data = this.getFreshSeedState();
    this.addUxDemoFixtures(this.data);
    this.addDemoStoryFixtures(this.data);
    this.addNov9DemoPlaces(this.data);
    this.save();
    return this.data;
  }

  private addNov9DemoPlaces(data:DatabaseSchema){
    if(!privateDemoEnabled||data.mapDemoVersion===1)return;data.mapDemoVersion=1;
    const base=CANONICAL_PLACES[0];
    for(const [id,name,kind,lat,lng,sponsored] of [['plc_demo_hotel','Hôtel Horizon Cocody · fictif','hotel',5.356,-4.004,true],['plc_demo_event','Maison des Rencontres · fictive','event',5.351,-3.991,false]] as const){
      if(!data.places.some(p=>p.id===id))data.places.push({...base,id,name,category:'autre',categoryLabel:kind==='hotel'?'Hôtel · démonstration':'Lieu d’événements · démonstration',description:'Exemple fictif pour essayer les repères. Aucun partenariat réel.',coordinates:{lat,lng},markerKind:kind,verificationStatus:'unverified',isCertified:false,isSponsored:sponsored,isDemo:true});
    }
  }

  private addDemoStoryFixtures(data:DatabaseSchema){
    if(!privateDemoEnabled)return false;
    let changed=data.demoStorySeedVersion!==2;data.demoStorySeedVersion=2;const now=Date.now();
    const examples=[['usr_sarah','profil-sarah.webp','Une pause entre amis · story fictive de présentation'],['usr_02','profil-amara.webp','Un moment culturel à Abidjan · story fictive de présentation'],['usr_nadia','profil-nadia.webp','Prête pour une nouvelle découverte · story fictive de présentation']];
    for(const [authorId,file,text]of examples){
      const author=data.users.find(u=>u.id===authorId);if(!author||author.age<18||author.visibility!=='public')continue;
      const id='demo_story_'+authorId;const previous=data.stories.find(s=>s.id===id);
      if(previous&&(!isPresentationStory(previous)||data.media.some(m=>'/api/media/'+m.assetId===previous.mediaUrl&&m.storyId===id&&m.ownerId===authorId)))continue;
      if(data.stories.filter(s=>s.authorId===authorId&&Date.parse(s.expiresAt)>now).length>=20)continue;
      data.stories=data.stories.filter(s=>s.id!==id);data.media=data.media.filter(m=>m.storyId!==id);
      const bytes=fs.readFileSync(new URL('../public/illustrations/'+file,import.meta.url));if(data.media.reduce((n,m)=>n+m.sizeBytes,0)+bytes.length>50*1024*1024)continue;const assetId=crypto.randomBytes(20).toString('hex');
      data.stories.push({id,authorId,mediaUrl:'/api/media/'+assetId,mediaType:'image',text,audience:'public',createdAt:new Date(now).toISOString(),expiresAt:new Date(now+86400000).toISOString(),isDemo:true});
      changed=true;data.media.push({assetId,ownerId:authorId,ownerUsername:author.username,audience:'public',mimeType:'image/webp',sizeBytes:bytes.length,dataBase64:bytes.toString('base64'),createdAt:new Date(now).toISOString(),token:crypto.randomBytes(24).toString('hex'),storyId:id});
    }
    return changed;
  }
  public ensureDemoStories(){if(this.addDemoStoryFixtures(this.data))this.save();}
  public prepareDemoStories(){this.ensureDemoStories();return this.data.stories.filter(s=>isPresentationStory(s)).length;}

  private addUxDemoFixtures(data:DatabaseSchema){
    if(!privateDemoEnabled||data.demoUxVersion===1)return;
    data.demoUxVersion=1;
    const now=new Date().toISOString();
    for(const [id,title,body,targetId] of [['demo_activity_like','J’aime · démonstration','Bintou aime votre découverte fictive.','plc_maquis_etoile'],['demo_activity_comment','Commentaire · démonstration','Georges : une adresse à découvrir !','plc_cocody_lounge']])if(!data.activity.some(a=>a.id===id))data.activity.push({id,title,body,targetId,targetType:'place',recipientId:'usr_01',createdAt:now,isDemo:true});
    for(const [a,b] of [['usr_01','usr_sarah'],['usr_sarah','usr_01'],['usr_01','usr_02'],['usr_02','usr_01']])if(data.users.some(u=>u.id===a)&&data.users.some(u=>u.id===b)&&!data.follows.some(f=>f.followerId===a&&f.followedId===b))data.follows.push({id:'demo_ux_'+a+'_'+b,followerId:a,followedId:b,createdAt:now});
    for(const message of [{id:'demo_dm_georges_01',senderId:'usr_02',recipientId:'usr_01',text:'On découvre ce maquis à Cocody ? · échange fictif',entity:{type:'place' as const,id:'plc_maquis_etoile'},createdAt:now,isDemo:true},{id:'demo_dm_grace_02',senderId:'usr_nadia',recipientId:'usr_02',text:'Une sortie culturelle cette semaine ? · échange fictif',entity:{type:'event' as const,id:'evt_02'},createdAt:now,isDemo:true}])if(!data.messages.some(m=>m.id===message.id))data.messages.push(message);
  }

  private save(dataToSave?: DatabaseSchema) {
    if(this.transactionDepth>0)return;
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
    return this.data.places.filter(p=>!p.mergedInto);
  }

  public findPlaceById(id: string): PlaceEntity | undefined {
    const seen=new Set<string>();let place=this.data.places.find(p=>p.id===id);while(place?.mergedInto&&!seen.has(place.id)){seen.add(place.id);place=this.data.places.find(p=>p.id===place!.mergedInto);}return place&&!seen.has(place.id)?place:undefined;
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

    if(awardedXp>0)this.creditCheckin(checkin.id,awardedXp);

    this.save();
    return checkin;
  }

  public creditCheckin(id:string,amount:number):number{
    const check=this.findCheckinById(id),user=check&&this.findUserById(check.userId);
    if(!check||!user||![50,75].includes(amount)||this.data.points_ledger.some(p=>p.sourceAction==='CHECKIN_VERIFIED'&&p.referenceId===id))return 0;
    check.status='verified';check.awardedXp=amount;user.xpPoints+=amount;user.checkinsCount++;user.level=Math.floor(user.xpPoints/300)+1;
    this.data.points_ledger.push({id:crypto.randomUUID(),userId:user.id,amount,sourceAction:'CHECKIN_VERIFIED',referenceId:id,timestamp:new Date().toISOString()});this.save();return amount;
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

  public unfollowUser(followerId: string, followedId: string): void {
    if (!this.isFollower(followerId, followedId)) return;
    this.data.follows = this.data.follows.filter(follow => !(follow.followerId === followerId && follow.followedId === followedId));
    const followed = this.findUserById(followedId);
    const follower = this.findUserById(followerId);
    if (followed) followed.followersCount = Math.max(0, followed.followersCount - 1);
    if (follower) follower.followingCount = Math.max(0, follower.followingCount - 1);
    this.save();
  }

  public recordLedgerEvent(userId:string,sourceAction:string,referenceId:string):boolean {
    if(this.data.points_ledger.some(entry=>entry.userId===userId&&entry.sourceAction===sourceAction&&entry.referenceId===referenceId)) return false;
    this.data.points_ledger.push({id:crypto.randomUUID(),userId,sourceAction,referenceId,amount:0,timestamp:new Date().toISOString()});
    this.save();return true;
  }

  public validateSnapshot(data:unknown):void {
    if(!data||typeof data!=='object')throw new Error('Invalid snapshot');
    const value=data as DatabaseSchema;
    validateUxTables(value);
    if(value.saved_content!==undefined&&(!Array.isArray(value.saved_content)||value.saved_content.some(item=>!item||typeof item.userId!=='string'||typeof item.id!=='string'||!['post','event'].includes(item.type))))throw new Error('Invalid saved content');
    if(value.activity!==undefined&&(!Array.isArray(value.activity)||value.activity.some(item=>!item||typeof item.id!=='string'||typeof item.recipientId!=='string'||typeof item.body!=='string')))throw new Error('Invalid activity');
    if(value.messages!==undefined&&(!Array.isArray(value.messages)||value.messages.some(m=>!m||typeof m.id!=='string'||typeof m.senderId!=='string'||typeof m.recipientId!=='string'||typeof m.text!=='string'||m.text.length>2000||!Number.isFinite(Date.parse(m.createdAt)))))throw new Error('Invalid messages');
    if(value.stories!==undefined&&(!Array.isArray(value.stories)||value.stories.some(story=>!story||typeof story.id!=='string'||!Number.isFinite(Date.parse(story.expiresAt)))))throw new Error('Invalid stories');
    for(const field of ['users','sessions','places','checkins','checkin_proofs','points_ledger','follows','reviews','posts','saved_places','media','reports'] as const)if(!Array.isArray(value[field]))throw new Error('Invalid snapshot table');
    for(const field of ['users','sessions','places','checkins','checkin_proofs','points_ledger','follows','reviews','posts','saved_places','media','reports'] as const)if(value[field].some(row=>!row||typeof row!=='object'))throw new Error('Invalid snapshot row');
    if(new Set(value.users.map(user=>user.id)).size!==value.users.length||new Set(value.users.map(user=>user.username)).size!==value.users.length)throw new Error('Duplicate user');
    for(const post of value.posts)if(typeof post.id!=='string'||typeof post.authorId!=='string'||typeof post.text!=='string'||!Array.isArray(post.comments)||!Array.isArray(post.likedBy))throw new Error('Invalid post');
    if(!value.users.some(user=>user.id==='usr_admin'))throw new Error('Missing operator');
    for(const user of value.users)if(typeof user.id!=='string'||typeof user.username!=='string'||typeof user.passwordHash!=='string'||typeof user.salt!=='string')throw new Error('Invalid user');
  }
  public restoreSnapshot(snapshot:DatabaseSchema):void {
    this.validateSnapshot(snapshot);
    const previous=this.data;
    try{this.save({...snapshot,sessions:[]});this.data=this.load();}
    catch(error){this.save(previous);this.data=previous;throw error;}
  }

  public updateSharedData(next: Partial<Pick<DatabaseSchema,'saved_content'|'activity'|'messages'|'stories'|'posts'|'saved_places'|'media'|'places'|'place_sources'|'place_proposals'>>):void {
    const updated={...this.data,...next};
    validateUxTables(updated);
    this.save(updated);
    this.data=updated;
  }

  public getReviews(placeId: string): ReviewEntity[] {
    return this.data.reviews.filter(review => review.placeId === placeId&&!review.superseded).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  public saveReview(userId: string, placeId: string, rating: number, comment: string): ReviewEntity {
    const existing = this.data.reviews.find(review => review.userId === userId && review.placeId === placeId&&!review.superseded);
    const review = { id: existing?.id || crypto.randomUUID(), userId, placeId, rating, comment, updatedAt: new Date().toISOString() };
    if (existing) Object.assign(existing, review);
    else this.data.reviews.push(review);
    this.save();
    return review;
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
