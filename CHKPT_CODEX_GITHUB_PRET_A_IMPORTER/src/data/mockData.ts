/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Canonical Reference Data for Abidjan (Cocody priority)
 */

import { 
  Place, 
  UserProfile, 
  Post, 
  EventItem, 
  Badge, 
  AdCampaign, 
  PlaceProposal, 
  ModerationCase 
} from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'usr_01',
  username: 'koffi_urbex',
  displayName: 'Koffi Kouamé',
  avatarUrl: '/illustrations/koffi.svg',
  bio: "Explorateur urbain d'Abidjan · Foodie & rooftops chill · Spécialiste Cocody",
  homeZone: 'Cocody, Abidjan',
  level: 4,
  xpPoints: 1240,
  role: 'user',
  age: 24,
  visibility: 'public',
  followersCount: 389,
  followingCount: 142,
  checkinsCount: 18,
  badgesCount: 7,
  createdAt: '2026-01-15T10:00:00Z',
};

export const INITIAL_PLACES: Place[] = [
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
    openingHours: 'Tous les jours : 17h00 - 02h00',
    isCurrentlyOpen: true,
    coverImage: '/illustrations/rooftop.svg',
    galleryImages: [
      '/illustrations/rooftop.svg',
      '/illustrations/cafe.svg'
    ],
    tags: ['Rooftop', 'Vue Lagune', 'Cocktails', 'Sunset', 'Classy Street'],
    totalCheckins: 142,
    rating: 4.8,
    reviewCount: 38,
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
    openingHours: 'Mardi au Dimanche : 11h30 - 01h00',
    isCurrentlyOpen: true,
    coverImage: '/illustrations/maquis-demo.png',
    galleryImages: [
      '/illustrations/maquis-demo.png',
      '/illustrations/maquis-demo.png'
    ],
    tags: ['Poisson braisé', 'Alloco', 'Attiéké', 'Convivial', 'Musique live'],
    totalCheckins: 289,
    rating: 4.9,
    reviewCount: 64,
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
    openingHours: 'Tous les jours : 07h00 - 20h00',
    isCurrentlyOpen: true,
    coverImage: '/illustrations/cafe.svg',
    galleryImages: [
      '/illustrations/cafe.svg'
    ],
    tags: ['Spécialité Café', 'Brunch', 'Pâtisseries', 'Coworking calme'],
    totalCheckins: 94,
    rating: 4.7,
    reviewCount: 22,
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
    openingHours: 'Mercredi au Dimanche : 10h00 - 19h00',
    isCurrentlyOpen: true,
    coverImage: '/illustrations/art.svg',
    galleryImages: [
      '/illustrations/art.svg'
    ],
    tags: ['Exposition', 'Art Contemporain', 'Design', 'Vernissage'],
    totalCheckins: 56,
    rating: 4.6,
    reviewCount: 15,
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
    openingHours: 'Tous les soirs : 18h00 - 04h00',
    isCurrentlyOpen: true,
    coverImage: '/illustrations/maquis.svg',
    galleryImages: [],
    tags: ['Plein air', 'Ambiance Nuit', 'Lieu Historique', 'Grillades'],
    totalCheckins: 320,
    rating: 4.5,
    reviewCount: 88,
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
    openingHours: 'Lundi au Samedi : 12h00 - 23h30',
    isCurrentlyOpen: true,
    coverImage: '/illustrations/maquis.svg',
    galleryImages: [],
    tags: ['Bistronomie', 'Vue Pont', 'Dîner Romantique', 'Cave à vin'],
    totalCheckins: 110,
    rating: 4.8,
    reviewCount: 29,
    isCertified: true,
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'pst_maquis_demo', authorId: 'usr_01', authorName: 'Koffi Kouamé',
    authorUsername: 'koffi_urbex', authorAvatar: '/illustrations/koffi.svg',
    createdAt: 'Publication de démonstration',
    text: 'Une belle découverte à Cocody : une terrasse, du braisé et une soirée entre amis.',
    mediaUrl: '/illustrations/maquis-demo.png', mediaType: 'image',
    linkedPlaceId: 'plc_maquis_etoile', linkedPlaceName: "Maquis L’Étoile d’Abidjan",
    isVerifiedVisit: false, audience: 'public', likesCount: 0, isLikedByCurrentUser: false,
    commentsCount: 0, comments: [],
  },
  {
    id: 'pst_01',
    authorId: 'usr_sarah',
    authorName: 'Sarah Diallo',
    authorUsername: 'sarah_dlo',
    authorAvatar: '/illustrations/sarah.svg',
    createdAt: 'Il y a 32 min',
    text: 'Coucher de soleil magique sur la lagune Ébrié depuis le Lagon Bleu ! Les brochettes d\'escargots braisés et le cocktail kinkeliba sont tout simplement parfaits.',
    mediaUrl: '/illustrations/rooftop-demo.png',
    mediaType: 'image',
    linkedPlaceId: 'plc_cocody_lounge',
    linkedPlaceName: 'Lagon Bleu Rooftop Lounge',
    isVerifiedVisit: true,
    audience: 'public',
    likesCount: 42,
    isLikedByCurrentUser: true,
    commentsCount: 3,
    comments: [
      {
        id: 'cmt_1',
        authorId: 'usr_01',
        authorName: 'Koffi Kouamé',
        authorAvatar: '/illustrations/koffi.svg',
        text: 'La vue au crépuscule reste imbattable à Cocody Danga !',
        createdAt: 'Il y a 15 min'
      }
    ]
  },
  {
    id: 'pst_02',
    authorId: 'usr_02',
    authorName: 'Amara Koné',
    authorUsername: 'amara_sound',
    authorAvatar: '/illustrations/admin.svg',
    createdAt: 'Il y a 2h',
    text: 'Ambiance live acoustique ce soir aux Deux-Plateaux Vallons. Des toiles magnifiques et un accueil chaleureux.',
    mediaUrl: '/illustrations/culture-demo.png',
    mediaType: 'image',
    linkedPlaceId: 'plc_galerie_ceci',
    linkedPlaceName: "Centre d'Art Urbain & Céramique Babi",
    isVerifiedVisit: true,
    audience: 'public',
    likesCount: 19,
    isLikedByCurrentUser: false,
    commentsCount: 1,
    comments: []
  }
];

const upcomingDate = (days: number, hour: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt_01',
    title: 'Nuit Urbaine Abidjan & Live Beats',
    dateLabel: 'Demain · 19h00',
    timeLabel: '19h00 - 02h00',
    utcDate: upcomingDate(1, 19),
    locationName: 'Lagon Bleu Rooftop Lounge',
    commune: 'Cocody',
    description: 'Session DJ set afro-house, percussions traditionnelles en live et dégustation de cocktails signatures.',
    coverImage: '/illustrations/night.svg',
    priceLabel: 'Entrée libre (Conso requise)',
    organizerName: 'Collectif Babi Groove',
    category: 'Musique & Nuit',
    interestedCount: 88,
    goingCount: 34,
    userIntent: null
  },
  {
    id: 'evt_02',
    title: 'Vernissage & Céramique Contemporaine',
    dateLabel: 'Dans 4 jours · 18h00',
    timeLabel: '18h30 - 21h30',
    utcDate: upcomingDate(4, 18),
    locationName: "Centre d'Art Urbain Babi",
    commune: 'Cocody',
    description: 'Rencontre avec 6 jeunes plasticiens ivoiriens explorant la terre cuite et les textures de Grand-Bassam.',
    coverImage: '/illustrations/art.svg',
    priceLabel: 'Accès gratuit sur inscription',
    organizerName: 'Fondation Babi Arts',
    category: 'Culture & Art',
    interestedCount: 54,
    goingCount: 19,
    userIntent: null
  }
];

// The 8 Canonical Badge Families of CHKPT
export const INITIAL_BADGES: Badge[] = [
  {
    id: 'bdg_maquis_bronze',
    name: 'Initié du Braisé',
    family: 'Maquis Master',
    tier: 'bronze',
    description: 'Validez votre présence dans 5 maquis certifiés d\'Abidjan.',
    iconName: 'Flame',
    requiredCount: 5,
    currentCount: 4, // Set to 4 so checking into Maquis L'Etoile triggers unlock 5/5!
    isUnlocked: false,
    xpReward: 100
  },
  {
    id: 'bdg_explorateur_bronze',
    name: 'Flâneur de Cocody',
    family: 'Explorateur',
    tier: 'bronze',
    description: 'Validez votre présence dans au moins 10 lieux différents à Cocody.',
    iconName: 'Compass',
    requiredCount: 10,
    currentCount: 8,
    isUnlocked: false,
    xpReward: 150
  },
  {
    id: 'bdg_foodie_bronze',
    name: 'Gourmet de Babi',
    family: 'Foodie',
    tier: 'bronze',
    description: 'Check-in dans 5 restaurants et cafés réputés.',
    iconName: 'Utensils',
    requiredCount: 5,
    currentCount: 5,
    isUnlocked: true,
    unlockedAt: '2026-10-12T14:20:00Z',
    xpReward: 100
  },
  {
    id: 'bdg_culture_bronze',
    name: 'Amateur d\'Art Babi',
    family: 'Culture Hunter',
    tier: 'bronze',
    description: 'Visitez 3 galeries d\'art ou musées à Abidjan.',
    iconName: 'Palette',
    requiredCount: 3,
    currentCount: 2,
    isUnlocked: false,
    xpReward: 80
  },
  {
    id: 'bdg_event_bronze',
    name: 'Noctambule Festif',
    family: 'Event Hunter',
    tier: 'bronze',
    description: 'Confirmez votre présence lors de 3 événements culturels.',
    iconName: 'CalendarCheck',
    requiredCount: 3,
    currentCount: 2,
    isUnlocked: false,
    xpReward: 120
  },
  {
    id: 'bdg_pionnier_bronze',
    name: 'Éclaireur Urbain',
    family: 'Pionnier',
    tier: 'bronze',
    description: 'Soyez parmi les 5 premiers explorateurs à valider un nouveau lieu.',
    iconName: 'Sparkles',
    requiredCount: 1,
    currentCount: 1,
    isUnlocked: true,
    unlockedAt: '2026-09-04T18:00:00Z',
    xpReward: 150
  },
  {
    id: 'bdg_photographe_bronze',
    name: 'Regard Visuel',
    family: 'Photographe',
    tier: 'bronze',
    description: 'Publiez 5 photographies de lieux vérifiés purgées d\'EXIF.',
    iconName: 'Camera',
    requiredCount: 5,
    currentCount: 3,
    isUnlocked: false,
    xpReward: 80
  },
  {
    id: 'bdg_multi_bronze',
    name: 'Traverseur de Ponts',
    family: 'Multi-Explorer',
    tier: 'bronze',
    description: 'Validez au moins 1 check-in dans 3 communes différentes (Cocody, Plateau, Marcory).',
    iconName: 'Map',
    requiredCount: 3,
    currentCount: 2,
    isUnlocked: false,
    xpReward: 200
  }
];

export const INITIAL_AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'ad_01',
    advertiserName: 'Banque Boucle · banque imaginaire',
    bannerTitle: 'Vos projets prennent de l’élan.',
    bannerSubtitle: 'Banque imaginaire · Aucun service financier proposé.',
    imageUrl: '/illustrations/banque-demo.png',
    ctaText: 'Campagne fictive · non cliquable',
    isNonClickableNotice: true,
    targetCommune: 'Cocody'
  },
  {
    id: 'ad_02',
    advertiserName: 'Café de démonstration',
    bannerTitle: 'Nouvelle carte des thés et infusions ivoiriennes',
    bannerSubtitle: 'Exemple de campagne locale fictive, sans partenariat réel.',
    imageUrl: '/illustrations/cafe.svg',
    ctaText: 'Exemple de campagne',
    isNonClickableNotice: true,
    targetCommune: 'Cocody'
  }
];

export const INITIAL_PLACE_PROPOSALS: PlaceProposal[] = [
  {
    id: 'prp_01',
    name: 'Le Balafon Gourmand',
    category: 'restaurants',
    commune: 'Cocody',
    address: 'Carrefour Duncan, Deux-Plateaux, Cocody',
    landmark: 'En face du supermarché Cash & Carry',
    coordinates: { lat: 5.3621, lng: -3.9912 },
    contributorId: 'usr_sarah',
    contributorName: 'Sarah Diallo',
    submittedAt: '2026-10-25T11:20:00Z',
    status: 'pending'
  }
];

export const INITIAL_MODERATION_CASES: ModerationCase[] = [
  {
    id: 'mod_01',
    targetType: 'comment',
    targetId: 'cmt_sp_01',
    targetAuthorName: 'anonyme_babi',
    reportedReason: 'Propos publicitaires non déclarés / spam',
    severity: 'low',
    snippet: 'Appelez ce numéro pour acheter des tickets de concert au noir...',
    status: 'pending',
    reportedAt: '2026-10-25T15:40:00Z'
  }
];
