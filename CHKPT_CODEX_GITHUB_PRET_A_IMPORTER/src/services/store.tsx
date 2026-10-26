/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT & RED LOOP State Store (React Context + Server State + Dynamic Gamification)
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Place, 
  CheckIn, 
  Post, 
  EventItem, 
  Badge, 
  UserProfile, 
  AdCampaign, 
  PlaceProposal, 
  ModerationCase, 
  PointsLedgerEntry, 
  Coordinates,
  CheckInAudience,
  AppNotification,
  NotificationPreferences
} from '../types';
import { 
  CURRENT_USER, 
  INITIAL_PLACES, 
  INITIAL_POSTS, 
  INITIAL_EVENTS, 
  INITIAL_BADGES, 
  INITIAL_AD_CAMPAIGNS, 
  INITIAL_MODERATION_CASES, 
  INITIAL_PLACE_PROPOSALS 
} from '../data/mockData';
import { 
  ABIDJAN_TEST_LOCATIONS, 
  SimulatedSpot, 
  calculateDistanceMeters 
} from './geoService';
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  canDeliverNotification,
  triggerNativeNotification,
} from './notificationService';

interface StoreContextType {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  followingIds: string[];
  authSessionToken: string;
  setAuthSessionToken: (token: string) => void;
  appEnvironment: 'demo' | 'production';
  setAppEnvironment: (env: 'demo' | 'production') => void;
  places: Place[];
  savedPlaceIds: string[];
  checkins: CheckIn[];
  posts: Post[];
  events: EventItem[];
  badges: Badge[];
  pointsLedger: PointsLedgerEntry[];
  adCampaigns: AdCampaign[];
  placeProposals: PlaceProposal[];
  moderationCases: ModerationCase[];
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  // GPS & Simulation
  activeLocationMode: 'simulation' | 'browser_gps';
  setActiveLocationMode: (mode: 'simulation' | 'browser_gps') => void;
  currentSimulatedSpot: SimulatedSpot;
  setCurrentSimulatedSpot: (spot: SimulatedSpot) => void;
  userCurrentCoordinates: Coordinates;
  // Operator Mode
  isOperatorView: boolean;
  setIsOperatorView: (val: boolean) => void;
  // Actions
  submitCheckIn: (placeId: string, audience: CheckInAudience) => Promise<{
    success: boolean;
    checkIn?: CheckIn;
    message: string;
    distanceMeters: number;
    earnedXp?: number;
    unlockedBadgeName?: string;
  }>;
  createPost: (data: {
    text: string;
    mediaUrl?: string;
    linkedPlaceId?: string;
    linkedCheckinId?: string;
    isVerifiedVisit: boolean;
  }) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleSavePlace: (placeId: string) => void;
  toggleEventIntent: (eventId: string, intent: 'interested' | 'going') => void;
  submitPlaceProposal: (data: Omit<PlaceProposal, 'id' | 'contributorId' | 'contributorName' | 'submittedAt' | 'status'>) => void;
  resetDemoPitchState: (start?: boolean) => Promise<void>;
  // Notifications
  notifications: AppNotification[];
  notificationPreferences: NotificationPreferences;
  activeToastNotification: AppNotification | null;
  unreadNotificationsCount: number;
  dispatchNotification: (data: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>, isEssential?: boolean) => { success: boolean; reason?: string };
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  simulateFriendCheckinNotification: () => void;
  simulateNearbyEventNotification: () => void;
  dismissToastNotification: () => void;
  // Admin Operator Actions
  approveProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string, reason: string) => void;
  resolveModerationCase: (caseId: string, action: 'resolved' | 'dismissed') => void;
  togglePlaceVerification: (placeId: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_PREFIX = 'chkpt_abidjan_v1_';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authSessionToken, setAuthSessionTokenState] = useState<string>(() => {
    return localStorage.getItem('chkpt_session_token') || '';
  });

  const statsRevision = useRef(0);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [appEnvironment, setAppEnvironment] = useState<'demo' | 'production'>('demo');

  const setAuthSessionToken = (token: string) => {
    setAuthSessionTokenState(token);
    localStorage.setItem('chkpt_session_token', token);
  };

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  // Sync places from server canonical database
  const [places, setPlaces] = useState<Place[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}places`);
    return saved ? JSON.parse(saved) : INITIAL_PLACES;
  });

  useEffect(() => {
    fetch('/api/places')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.places) && data.places.length > 0) {
          setPlaces((prev) => {
            return data.places.map((serverPlace: any) => {
              const localMatch = prev.find((p) => p.id === serverPlace.id);
              return {
                ...serverPlace,
                rating: localMatch?.rating || 4.7,
                reviewCount: localMatch?.reviewCount || 20,
                totalCheckins: localMatch?.totalCheckins || serverPlace.totalCheckins || 50,
                galleryImages: localMatch?.galleryImages || [serverPlace.coverImage],
                isCurrentlyOpen: true,
                priceLevel: serverPlace.priceLevel || '€€',
              };
            });
          });
        }
      })
      .catch((err) => console.warn('Could not sync places from /api/places:', err));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const requestedStatsRevision = statsRevision.current;
    fetch('/api/auth/me', {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${authSessionToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (controller.signal.aborted) return;
        setFollowingIds(Array.isArray(data.followingIds) ? data.followingIds : []);
        if (data.authenticated && data.user) {
          setCurrentUser((prev) => ({
            ...prev,
            id: data.user.id,
            username: data.user.username,
            displayName: data.user.displayName,
            role: data.user.role,
            age: data.user.age,
            visibility: data.user.visibility,
            xpPoints: requestedStatsRevision !== statsRevision.current && prev.id === data.user.id ? prev.xpPoints : data.user.xpPoints,
            checkinsCount: requestedStatsRevision !== statsRevision.current && prev.id === data.user.id ? prev.checkinsCount : data.user.checkinsCount,
            level: requestedStatsRevision !== statsRevision.current && prev.id === data.user.id ? prev.level : data.user.level,
            homeZone: data.user.homeZone,
            avatarUrl: data.user.avatarUrl,
            bio: data.user.bio,
            followersCount: data.user.followersCount,
            followingCount: data.user.followingCount,
          }));
        } else {
          setCurrentUser(CURRENT_USER);
          setIsOperatorView(false);
        }
      })
      .catch((err) => { if (err.name !== 'AbortError') console.warn('Sync /api/auth/me error:', err); });
    return () => controller.abort();
  }, [authSessionToken]);

  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}saved_places`);
    return saved ? JSON.parse(saved) : ['plc_cocody_lounge'];
  });

  const [checkins, setCheckins] = useState<CheckIn[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}checkins`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'chk_demo_01',
        userId: 'usr_01',
        userName: 'Koffi Kouamé',
        userAvatar: CURRENT_USER.avatarUrl,
        placeId: 'plc_cocody_lounge',
        placeName: 'Lagon Bleu Rooftop Lounge',
        placeCategory: 'bars_lounges',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'verified',
        audience: 'public',
        idempotencyKey: 'usr_01_plc_cocody_lounge_prev',
        distanceMeters: 28,
        gpsAccuracyMeters: 12,
        verifiedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        isFirstVisitForUser: true,
      }
    ];
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}posts`);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}badges`);
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [pointsLedger, setPointsLedger] = useState<PointsLedgerEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}ledger`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'ledg_01',
        userId: 'usr_01',
        sourceAction: 'CHECKIN_VERIFIED',
        deltaXp: 50,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        referenceId: 'chk_demo_01',
        label: 'Visite vérifiée au Lagon Bleu Rooftop (+50 XP)'
      },
      {
        id: 'ledg_02',
        userId: 'usr_01',
        sourceAction: 'FIRST_VISIT',
        deltaXp: 50,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        referenceId: 'plc_cocody_lounge',
        label: 'Première découverte de spot Cocody (+50 XP)'
      }
    ];
  });

  const [adCampaigns] = useState<AdCampaign[]>(INITIAL_AD_CAMPAIGNS);
  
  const [placeProposals, setPlaceProposals] = useState<PlaceProposal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}proposals`);
    return saved ? JSON.parse(saved) : INITIAL_PLACE_PROPOSALS;
  });

  const [moderationCases, setModerationCases] = useState<ModerationCase[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}moderation`);
    return saved ? JSON.parse(saved) : INITIAL_MODERATION_CASES;
  });

  // Local Push Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif_01',
        recipientId: 'usr_01',
        category: 'friends_checkin',
        title: 'Check-in d\'ami vérifié 📍',
        body: 'Sarah Diallo vient de valider sa présence au Lagon Bleu Rooftop (Cocody Danga) !',
        targetType: 'place',
        targetId: 'plc_cocody_lounge',
        isRead: false,
        createdAt: 'Il y a 12 min',
        avatarUrl: '/illustrations/sarah.svg',
      },
      {
        id: 'notif_02',
        recipientId: 'usr_01',
        category: 'nearby_event',
        title: 'Événement ce soir à Cocody ✨',
        body: 'Nuit Urbaine Abidjan & Live Beats commence à 19h aux Vallons. 72 amis y seront !',
        targetType: 'event',
        targetId: 'evt_01',
        isRead: true,
        createdAt: 'Il y a 3h',
        avatarUrl: '/illustrations/night.svg',
      }
    ];
  });

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notif_prefs`);
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATION_PREFERENCES;
  });

  const [activeToastNotification, setActiveToastNotification] = useState<AppNotification | null>(null);

  // Filters & State
  const [selectedZone, setSelectedZone] = useState<string>('Cocody');
  const [activeLocationMode, setActiveLocationMode] = useState<'simulation' | 'browser_gps'>('simulation');
  const [currentSimulatedSpot, setCurrentSimulatedSpot] = useState<SimulatedSpot>(ABIDJAN_TEST_LOCATIONS[0]);
  const [browserCoordinates, setBrowserCoordinates] = useState<Coordinates | null>(null);
  const [isOperatorView, setIsOperatorView] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}ledger`, JSON.stringify(pointsLedger));
  }, [pointsLedger]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}places`, JSON.stringify(places));
  }, [places]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}checkins`, JSON.stringify(checkins));
  }, [checkins]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}posts`, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}saved_places`, JSON.stringify(savedPlaceIds));
  }, [savedPlaceIds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}badges`, JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}proposals`, JSON.stringify(placeProposals));
  }, [placeProposals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}moderation`, JSON.stringify(moderationCases));
  }, [moderationCases]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notif_prefs`, JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  // Request browser GPS if mode is active
  useEffect(() => {
    let cancelled = false;
    if (activeLocationMode !== 'browser_gps') return;
    setBrowserCoordinates(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          setBrowserCoordinates({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          if (cancelled) return;
          console.warn('Geolocation permission error, falling back to simulated spot:', err.message);
          setActiveLocationMode('simulation');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else { setActiveLocationMode('simulation'); }
    return () => { cancelled = true; };
  }, [activeLocationMode]);

  const userCurrentCoordinates: Coordinates = 
    activeLocationMode === 'browser_gps' && browserCoordinates
      ? browserCoordinates
      : currentSimulatedSpot.coordinates;

  /**
   * Reset the entire Pitch Demo Scenario:
   * Restores pristine state on server and local client storage
   */
  const resetDemoPitchState = async (start = false) => {
    let started: any;
    try {
      const response = await fetch(start ? '/api/demo/start' : '/api/demo/reset', {
        method: 'POST', headers: { Authorization: `Bearer ${authSessionToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Réinitialisation refusée.');
      started = data;
    } catch (e) {
      console.warn('Server reset failed:', e);
      throw e;
    }

    // Clear local storage keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX) || key === 'chkpt_session_token') {
        localStorage.removeItem(key);
      }
    });

    // Reset in-memory states
    statsRevision.current += 1;
    setAuthSessionToken(started.token || '');
    setCurrentUser(started.user || CURRENT_USER);
    setPointsLedger([]);
    setNotifications([]);
    setPlaceProposals(INITIAL_PLACE_PROPOSALS);
    setModerationCases(INITIAL_MODERATION_CASES);
    setPlaces(INITIAL_PLACES);
    setCheckins([]);
    setPosts(INITIAL_POSTS);
    setEvents(INITIAL_EVENTS);
    setBadges(INITIAL_BADGES);
    setSavedPlaceIds(['plc_cocody_lounge']);
    setCurrentSimulatedSpot(ABIDJAN_TEST_LOCATIONS[0]);
    setActiveLocationMode('simulation');
    setIsOperatorView(false);

    dispatchNotification(
      {
        recipientId: CURRENT_USER.id,
        category: 'progression',
        title: 'Scénario pitch réinitialisé ✨',
        body: 'Tous les compteurs, check-ins et badges sont prêts pour une nouvelle démonstration de 3 minutes.',
      },
      true
    );
  };

  /**
   * Check-in execution engine respecting server verification rules:
   * Calls POST /api/checkins with verified session token
   * Server computes Haversine distance, enforces anti-spoofing & awards atomic XP.
   * Dynamically evaluates Badge unlocks!
   */
  const submitCheckIn = async (
    placeId: string, 
    audience: CheckInAudience
  ): Promise<{
    success: boolean;
    checkIn?: CheckIn;
    message: string;
    distanceMeters: number;
    earnedXp?: number;
    unlockedBadgeName?: string;
  }> => {
    if (activeLocationMode === 'browser_gps' && !browserCoordinates) {
      return { success: false, message: 'Position GPS en cours de recherche. Patientez ou choisissez explicitement le simulateur.', distanceMeters: 0 };
    }
    const place = places.find(p => p.id === placeId);
    if (!place) {
      return { success: false, message: 'Lieu introuvable dans le référentiel.', distanceMeters: 0 };
    }

    try {
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authSessionToken}`,
        },
        body: JSON.stringify({
          placeId,
          latitude: userCurrentCoordinates.lat,
          longitude: userCurrentCoordinates.lng,
          accuracyMeters: 15,
          isSimulated: activeLocationMode === 'simulation',
          audience,
          environment: appEnvironment,
        }),
      });

      const serverData = await response.json();

      if (!response.ok || !serverData.success) {
        const rejectedCheckIn: CheckIn = {
          id: serverData.checkIn?.id || `chk_rej_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.displayName,
          userAvatar: currentUser.avatarUrl,
          placeId: place.id,
          placeName: place.name,
          placeCategory: place.category,
          timestamp: new Date().toISOString(),
          status: 'rejected',
          audience,
          idempotencyKey: `${currentUser.id}_${place.id}_${Date.now()}`,
          distanceMeters: serverData.distanceMeters || 0,
          gpsAccuracyMeters: 15,
        };

        setCheckins(prev => [rejectedCheckIn, ...prev]);

        return {
          success: false,
          checkIn: rejectedCheckIn,
          message: serverData.message || 'Check-in rejeté par le serveur de vérification.',
          distanceMeters: serverData.distanceMeters || 0,
          earnedXp: 0,
        };
      }

      // Verified check-in confirmed by server!
      const serverCheckin = serverData.checkIn;
      const earnedXp = serverData.awardedXp || 50;

      // An older profile response must not roll back this confirmed server award.
      statsRevision.current += 1;
      const newCheckIn: CheckIn = {
        isSimulated: serverCheckin.isSimulated,
        id: serverCheckin.id,
        userId: currentUser.id,
        userName: currentUser.displayName,
        userAvatar: currentUser.avatarUrl,
        placeId: place.id,
        placeName: place.name,
        placeCategory: place.category,
        timestamp: serverCheckin.timestamp,
        status: 'verified',
        audience,
        idempotencyKey: serverCheckin.idempotencyKey,
        distanceMeters: serverData.distanceMeters,
        gpsAccuracyMeters: 15,
        verifiedAt: serverCheckin.createdAt,
        isFirstVisitForUser: earnedXp > 50,
      };

      setCheckins(prev => [newCheckIn, ...prev]);
      setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, totalCheckins: p.totalCheckins + 1 } : p));

      // Dynamic Gamification Engine: Evaluate and Unlock Badges
      let newlyUnlockedBadgeName: string | undefined;

      const nextBadges = badges.map((badge) => {
          let updatedCount = badge.currentCount;

          if (badge.family === 'Explorateur' && !badge.isUnlocked) {
            updatedCount += 1;
          }
          if (badge.family === 'Maquis Master' && place.category === 'maquis' && !badge.isUnlocked) {
            updatedCount += 1;
          }
          if (badge.family === 'Foodie' && (place.category === 'restaurants' || place.category === 'cafes_boulangeries') && !badge.isUnlocked) {
            updatedCount += 1;
          }
          if (badge.family === 'Culture Hunter' && place.category === 'culture_art' && !badge.isUnlocked) {
            updatedCount += 1;
          }

          const shouldUnlock = updatedCount >= badge.requiredCount && !badge.isUnlocked;

          if (shouldUnlock) {
            newlyUnlockedBadgeName = badge.name;
          }

          return {
            ...badge,
            currentCount: updatedCount,
            isUnlocked: badge.isUnlocked || shouldUnlock,
            unlockedAt: shouldUnlock ? new Date().toISOString() : badge.unlockedAt,
          };
      });
      setBadges(nextBadges);

      // Synchronize user XP directly with server award
      setCurrentUser(prev => ({
        ...prev,
        xpPoints: prev.xpPoints + earnedXp,
        checkinsCount: prev.checkinsCount + 1,
        level: Math.floor((prev.xpPoints + earnedXp) / 300) + 1,
      }));

      const ledgerEntry: PointsLedgerEntry = {
        id: `ledg_${Date.now()}`,
        userId: currentUser.id,
        sourceAction: 'CHECKIN_VERIFIED',
        deltaXp: earnedXp,
        timestamp: new Date().toISOString(),
        referenceId: newCheckIn.id,
        label: `Check-in vérifié au ${place.name} (+${earnedXp} XP)`,
      };
      setPointsLedger(prev => [ledgerEntry, ...prev]);

      if (newlyUnlockedBadgeName) {
        dispatchNotification(
          {
            recipientId: currentUser.id,
            category: 'progression',
            title: 'Badge débloqué ! 🏆',
            body: `Félicitations ! Vous venez de débloquer le badge "${newlyUnlockedBadgeName}" grâce à votre check-in.`,
            targetType: 'badge',
          },
          true
        );
      }

      return {
        success: true,
        checkIn: newCheckIn,
        message: serverData.message,
        distanceMeters: serverData.distanceMeters,
        earnedXp,
        unlockedBadgeName: newlyUnlockedBadgeName,
      };
    } catch (err: any) {
      console.error('Server checkin fetch error:', err);
      return {
        success: false,
        message: `Erreur de communication avec le serveur de vérification : ${err.message}`,
        distanceMeters: 0,
      };
    }
  };

  const createPost = (data: {
    text: string;
    mediaUrl?: string;
    linkedPlaceId?: string;
    linkedCheckinId?: string;
    isVerifiedVisit: boolean;
  }) => {
    const linkedPlace = data.linkedPlaceId ? places.find(p => p.id === data.linkedPlaceId) : undefined;
    
    const newPost: Post = {
      isSimulated: checkins.find(c => c.id === data.linkedCheckinId)?.isSimulated,
      id: `pst_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatarUrl,
      createdAt: 'À l\'instant',
      text: data.text,
      mediaUrl: data.mediaUrl,
      mediaType: 'image',
      linkedPlaceId: linkedPlace?.id,
      linkedPlaceName: linkedPlace?.name,
      linkedCheckinId: data.linkedCheckinId,
      isVerifiedVisit: data.isVerifiedVisit,
      audience: currentUser.visibility === 'private' ? 'private' : 'public',
      likesCount: 0,
      isLikedByCurrentUser: false,
      commentsCount: 0,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    // Publishing is optional and does not award visit XP.
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLikedByCurrentUser;
        return {
          ...p,
          isLikedByCurrentUser: isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `cmt_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatarUrl,
      text: text.trim(),
      createdAt: 'À l\'instant'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  const toggleSavePlace = (placeId: string) => {
    setSavedPlaceIds(prev => 
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  };

  const toggleEventIntent = (eventId: string, intent: 'interested' | 'going') => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const current = e.userIntent;
        let newIntent: 'interested' | 'going' | null = intent;
        let interested = e.interestedCount;
        let going = e.goingCount;

        if (current === intent) {
          newIntent = null;
          if (intent === 'interested') interested = Math.max(0, interested - 1);
          if (intent === 'going') going = Math.max(0, going - 1);
        } else {
          if (current === 'interested') interested = Math.max(0, interested - 1);
          if (current === 'going') going = Math.max(0, going - 1);
          if (intent === 'interested') interested++;
          if (intent === 'going') going++;
        }

        return {
          ...e,
          userIntent: newIntent,
          interestedCount: interested,
          goingCount: going
        };
      }
      return e;
    }));
  };

  const submitPlaceProposal = (data: Omit<PlaceProposal, 'id' | 'contributorId' | 'contributorName' | 'submittedAt' | 'status'>) => {
    const newProposal: PlaceProposal = {
      ...data,
      id: `prp_${Date.now()}`,
      contributorId: currentUser.id,
      contributorName: currentUser.displayName,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    setPlaceProposals(prev => [newProposal, ...prev]);
  };

  const approveProposal = (proposalId: string) => {
    const proposal = placeProposals.find(p => p.id === proposalId);
    if (!proposal) return;

    const newPlace: Place = {
      id: `plc_${Date.now()}`,
      name: proposal.name,
      category: proposal.category,
      categoryLabel: proposal.category === 'maquis' ? 'Maquis & Grillades' : 'Restaurant & Café',
      description: `Lieu proposé par la communauté (${proposal.landmark}).`,
      commune: proposal.commune,
      neighborhood: 'Quartier vérifié',
      address: proposal.address,
      coordinates: proposal.coordinates,
      verificationStatus: 'verified',
      claimStatus: 'unclaimed',
      exploitationStatus: 'open',
      priceLevel: '€€',
      priceDescription: '3 000 – 8 000 FCFA',
      openingHours: 'Tous les jours : 10h00 - 23h00',
      isCurrentlyOpen: true,
      tags: ['Nouveau', 'Validé RED LOOP'],
      coverImage: '/illustrations/maquis.svg',
      galleryImages: [],
      totalCheckins: 0,
      reviewCount: 0
    };

    setPlaces(prev => [newPlace, ...prev]);
    setPlaceProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'accepted' } : p));
  };

  const rejectProposal = (proposalId: string, reason: string) => {
    setPlaceProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'rejected', rejectionReason: reason } : p));
  };

  const resolveModerationCase = (caseId: string, action: 'resolved' | 'dismissed') => {
    setModerationCases(prev => prev.map(c => c.id === caseId ? { ...c, status: action } : c));
  };

  const togglePlaceVerification = (placeId: string) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        const nextStatus = p.verificationStatus === 'verified' ? 'unverified' : 'verified';
        return { ...p, verificationStatus: nextStatus };
      }
      return p;
    }));
  };

  // Notification Methods
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const dispatchNotification = (
    data: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>,
    isEssential: boolean = false
  ): { success: boolean; reason?: string } => {
    const check = canDeliverNotification(data.category, notificationPreferences, isEssential);
    if (!check.allowed) {
      return { success: false, reason: check.reason };
    }

    if (data.dedupeKey && notifications.some(n => n.dedupeKey === data.dedupeKey)) {
      return { success: false, reason: 'Notification identique déjà distribuée.' };
    }

    const newNotif: AppNotification = {
      ...data,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: 'À l\'instant',
      isRead: false,
    };

    setNotifications(prev => [newNotif, ...prev]);
    if (!isEssential) {
      setNotificationPreferences(prev => ({
        ...prev,
        weeklyRetentionCount: prev.weeklyRetentionCount + 1,
      }));
    }

    setActiveToastNotification(newNotif);
    triggerNativeNotification(newNotif.title, newNotif.body, newNotif.avatarUrl);

    setTimeout(() => {
      setActiveToastNotification(curr => (curr?.id === newNotif.id ? null : curr));
    }, 6000);

    return { success: true };
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => ({ ...prev, ...prefs }));
  };

  const dismissToastNotification = () => {
    setActiveToastNotification(null);
  };

  const simulateFriendCheckinNotification = () => {
    dispatchNotification({
      recipientId: currentUser.id,
      category: 'friends_checkin',
      title: 'Check-in d\'ami vérifié 📍',
      body: 'Sarah Diallo vient de valider sa présence au Lagon Bleu Rooftop (Cocody Danga) !',
      targetType: 'place',
      targetId: 'plc_cocody_lounge',
      avatarUrl: '/illustrations/sarah.svg',
      dedupeKey: `friend_checkin_${Date.now()}`,
    });
  };

  const simulateNearbyEventNotification = () => {
    dispatchNotification({
      recipientId: currentUser.id,
      category: 'nearby_event',
      title: 'Événement à proximité ce soir ✨',
      body: 'Nuit Urbaine Abidjan & Live Beats a lieu à 250m de votre position aux Vallons !',
      targetType: 'event',
      targetId: 'evt_01',
      avatarUrl: '/illustrations/night.svg',
      dedupeKey: `nearby_event_${Date.now()}`,
    });
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      setCurrentUser,
      followingIds,
      authSessionToken,
      setAuthSessionToken,
      appEnvironment,
      setAppEnvironment,
      places,
      savedPlaceIds,
      checkins,
      posts,
      events,
      badges,
      pointsLedger,
      adCampaigns,
      placeProposals,
      moderationCases,
      selectedZone,
      setSelectedZone,
      activeLocationMode,
      setActiveLocationMode,
      currentSimulatedSpot,
      setCurrentSimulatedSpot,
      userCurrentCoordinates,
      isOperatorView,
      setIsOperatorView,
      submitCheckIn,
      createPost,
      likePost,
      addComment,
      toggleSavePlace,
      toggleEventIntent,
      submitPlaceProposal,
      resetDemoPitchState,
      approveProposal,
      rejectProposal,
      resolveModerationCase,
      togglePlaceVerification,
      notifications,
      notificationPreferences,
      activeToastNotification,
      unreadNotificationsCount,
      dispatchNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      updateNotificationPreferences,
      simulateFriendCheckinNotification,
      simulateNearbyEventNotification,
      dismissToastNotification,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
