import {DEMO_PROFILES} from './demoProfiles';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Canonical Reference Data for Abidjan (Cocody priority)
 */

import { demoBadges } from '../../shared/badgeCatalog';
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
  username: 'yacoub_ouattara',
  displayName: 'Yacoub Ouattara',
  avatarUrl: '/illustrations/profil-koffi.webp',
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

const ORIGINAL_POSTS: Post[] = [
  {
    id: 'pst_maquis_demo', authorId: 'usr_01', authorName: 'Yacoub Ouattara',
    authorUsername: 'yacoub_ouattara', authorAvatar: '/illustrations/profil-koffi.webp',
    createdAt: 'Publication de démonstration',
    text: 'Une belle découverte à Cocody : une terrasse, du braisé et une soirée entre amis.',
    mediaUrl: '/illustrations/maquis-demo.png', mediaType: 'image',
    media: ['maquis-demo.png','maquis-braise-demo.png','maquis-boissons-demo.png','maquis-soiree-demo.png'].map(file=>({url:'/illustrations/'+file,type:'image' as const})),
    linkedPlaceId: 'plc_maquis_etoile', linkedPlaceName: "Maquis L’Étoile d’Abidjan",
    isVerifiedVisit: false, audience: 'public', likesCount: 0, isLikedByCurrentUser: false,
    commentsCount: 0, comments: [],
  },
  {
    id: 'pst_01',
    authorId: 'usr_sarah',
    authorName: 'Ingrid N’Goan',
    authorUsername: 'ingrid_ngoan',
    authorAvatar: '/illustrations/profil-sarah.webp',
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
        authorName: 'Yacoub Ouattara',
        authorAvatar: '/illustrations/profil-koffi.webp',
        text: 'La vue au crépuscule reste imbattable à Cocody Danga !',
        createdAt: 'Il y a 15 min'
      }
    ]
  },
  {
    id: 'pst_02',
    authorId: 'usr_02',
    authorName: 'Georges Armand',
    authorUsername: 'georges_armand',
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

const captions=[
 ["Une belle découverte à Cocody : une terrasse, du braisé et une soirée entre amis.","Le braisé du soir et l’attiéké : une association qui fait toujours plaisir. Sortie fictive au maquis.","Bissap ou gingembre ? Aujourd’hui je prends le temps de profiter de la terrasse.","Les lumières s’allument, la soirée commence tranquillement à Cocody. Une ambiance à partager.","Mon carnet du week-end : une table dehors, quelques amis et de nouvelles découvertes. Démonstration CHKPT."],
 ["Coucher de soleil magique sur la lagune Ébrié depuis le Lagon Bleu ! Les brochettes d'escargots braisés et le cocktail kinkeliba sont tout simplement parfaits.","Une pause en terrasse, des boissons fraîches et une vue qui donne envie de rester. Lieu fictif de démonstration.","Une belle assiette et une conversation qui dure : ma définition d’une bonne sortie entre amis.","La lumière de fin de journée change toute l’ambiance. Petite parenthèse au bord de la lagune, en illustration.","Cinq adresses à explorer un jour, mais ce soir je garde simplement ce coucher de soleil. Scénario fictif."],
 ["Ambiance live acoustique ce soir aux Deux-Plateaux Vallons. Des toiles magnifiques et un accueil chaleureux.","Couleurs, céramiques et conversations : un après-midi culturel dans cette cour fictive d’Abidjan.","Prendre le temps de regarder une œuvre, puis d’échanger autour d’un verre. Une idée de sortie simple.","Quand la musique rencontre les arts visuels, la soirée prend une autre dimension. Illustration de démonstration.","Mon prochain détour ? Un lieu culturel, une petite exposition et une découverte à raconter. Profil de prototype."],
 ["Un rooftop, la lagune et le soleil qui descend : tout ce qu’il faut pour une soirée fictive réussie.","Les terrasses d’Abidjan ont quelque chose de spécial au coucher du soleil. Visuel généré pour la démo.","Le programme du week-end : retrouver les amis et découvrir une nouvelle ambiance. Sans se presser.","Un verre de bissap bien frais pour commencer la soirée. La meilleure place, c’est celle qu’on partage.","Dernières lumières sur la terrasse avant de rentrer. Une sortie imaginée pour montrer CHKPT."],
];
const mediaFiles=[['maquis-demo.png','maquis-braise-demo.png','maquis-boissons-demo.png','maquis-soiree-demo.png','maquis-demo.png'],['rooftop-demo.png','maquis-boissons-demo.png','maquis-braise-demo.png','rooftop-demo.png','rooftop-demo.png'],['culture-demo.png','culture-demo.png','maquis-boissons-demo.png','culture-demo.png','culture-demo.png'],['rooftop-demo.png','rooftop-demo.png','maquis-soiree-demo.png','maquis-boissons-demo.png','rooftop-demo.png']];
export const INITIAL_POSTS:Post[]=Array.from({length:5},(_,round)=>DEMO_PROFILES.map((profile,index)=>{
 const original=round===0?ORIGINAL_POSTS.find(post=>post.authorId===profile.id):undefined;
 if(original)return {...original,authorAvatar:profile.avatarUrl};
 const cultural=index===2;const maquis=index===0;
 return {id:`pst_demo_${profile.id}_${round}`,authorId:profile.id,authorName:profile.displayName,authorUsername:profile.username,authorAvatar:profile.avatarUrl,createdAt:`Publication de démonstration · ${round+1}/5`,text:captions[index][round],mediaUrl:'/illustrations/'+mediaFiles[index][round],mediaType:'image' as const,linkedPlaceId:cultural?'plc_galerie_ceci':maquis?'plc_maquis_etoile':'plc_cocody_lounge',linkedPlaceName:cultural?"Centre d'Art Urbain & Céramique Babi":maquis?"Maquis L’Étoile d’Abidjan":'Lagon Bleu Rooftop Lounge',isVerifiedVisit:false,audience:'public' as const,likesCount:0,isLikedByCurrentUser:false,commentsCount:0,comments:[]};
})).flat();

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
export const INITIAL_BADGES: Badge[] = demoBadges();

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
    contributorName: 'Ingrid N’Goan',
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
