import {AudienceSelect} from '../common/AudienceSelect';
import { BrandSymbol } from '../common/BrandSymbol';
import { SafeImage } from '../common/SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT Check-in Verification Flow (Section 8: Server-Controlled Presence Verification)
 * Enforces:
 *  - Geodesic distance checking with real server validation
 *  - Dynamic XP awards & Badge Unlocks (Maquis Master, Foodie, Explorateur)
 *  - Non-coercive follow-up post creation
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '../../services/store';
import { Place, CheckInAudience, CheckIn } from '../../types';
import { calculateDistanceMeters, DEFAULT_CHECKIN_RADIUS_METERS } from '../../services/geoService';
import { PostMediaUploader } from '../common/PostMediaUploader';
import { 
  X, 
  Crosshair, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Users, 
  Globe, 
  MapPin, 
  Plus, 
  Sparkles,
  Camera,
  Loader2,
  Trophy
} from 'lucide-react';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostPublishedSuccess?: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({
  isOpen,
  onClose,
  onPostPublishedSuccess
}) => {
  const { 
    places,
    events,
    badges,
    userCurrentCoordinates, 
    submitCheckIn,
    recoverCheckIn,
    createPost, 
    submitPlaceProposal,
    activeLocationMode 
  } = useStore();

  const [step, setStep] = useState<'select_place' | 'verifying' | 'result' | 'optional_post' | 'propose_place'>(
    'select_place'
  );
  
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [eventId,setEventId]=useState('');
  const [audience, setAudience] = useState<CheckInAudience>('private');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    distanceMeters: number;
    earnedXp?: number;
    unlockedBadgeName?: string;
    checkIn?: CheckIn;
    recovered?:boolean;
    uncertain?:boolean;
  } | null>(null);

  // Optional post state
  const [postAudience,setPostAudience]=useState<CheckInAudience>('private');
  const [discard,setDiscard]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  const closeRef=useRef<()=>void>(()=>{});
  const [publishing,setPublishing]=useState(false);
  const [postText, setPostText] = useState('');
  const [postMedia, setPostMedia] = useState<import('../../types').PostMedia[]>([]);
  const [mediaBusy,setMediaBusy]=useState(false);

  // Propose place state
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState<any>('restaurants');
  const [newPlaceCommune, setNewPlaceCommune] = useState('Cocody');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [newPlaceLandmark, setNewPlaceLandmark] = useState('');
  const [proposalSent, setProposalSent] = useState(false);

  // Sort places by proximity to current coordinates
  const sortedPlaces = useMemo(() => {
    return [...places].map(p => ({
      ...p,
      distance: calculateDistanceMeters(userCurrentCoordinates, p.coordinates)
    })).sort((a, b) => a.distance - b.distance);
  }, [places, userCurrentCoordinates]);

  const requestClose=()=>{if(publishing||mediaBusy)return;if(step==='optional_post'&&(postText.trim()||postMedia.length)){setDiscard(true);return;}onClose();};
  closeRef.current=requestClose;
  useEffect(()=>{if(!isOpen)return;const previous=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';return()=>{dialog.current?.close();document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus();};},[isOpen]);
  if (!isOpen) return null;

  const currentPlace = places.find(p => p.id === selectedPlaceId);

  const handleExecuteCheckIn = async () => {
    if (!currentPlace) return;
    setIsVerifying(true);
    setStep('verifying');

    try {
      const res = await submitCheckIn(currentPlace.id, audience,eventId||undefined);
      setVerificationResult(res);
      setIsVerifying(false);
      setStep('result');
    } catch (err) {
      setIsVerifying(false);
      setVerificationResult({
        success: false,
        message: 'Erreur technique de validation.',
        distanceMeters: 0,
      });
      setStep('result');
    }
  };

  const handlePublishFollowupPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaBusy || !verificationResult?.checkIn || !currentPlace) return;

    setPublishing(true);
    const published=await createPost({
      text: postText.trim() || `Découverte de ${currentPlace.name} (${currentPlace.commune}) — ${verificationResult.checkIn.isSimulated ? 'visite simulée de démonstration' : 'check-in validé'}. ✨`,
      linkedPlaceId: currentPlace.id,
      linkedCheckinId: verificationResult.checkIn.id,
      isVerifiedVisit: true,
      audience:postAudience,
      media: postMedia.length?postMedia:[{url:currentPlace.coverImage,type:'image'}]
    });

    setPublishing(false);if(!published)return;
    onClose();
    if (onPostPublishedSuccess) onPostPublishedSuccess();
  };

  const handleProposeNewPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim()) return;

    submitPlaceProposal({
      name: newPlaceName.trim(),
      category: newPlaceCategory,
      commune: newPlaceCommune,
      address: newPlaceAddress.trim() || 'Adresse en cours de précision',
      landmark: newPlaceLandmark.trim() || 'Près du repère indiqué',
      coordinates: userCurrentCoordinates
    });

    setProposalSent(true);
  };

  return (
    <dialog ref={dialog} aria-label="Check-in" onCancel={event=>{event.preventDefault();closeRef.current();}}
      className="fixed inset-0 m-0 w-full max-w-none h-dvh max-h-none border-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface border border-line rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {discard&&<section role="alert" className="p-4 mb-4 border border-line rounded-xl bg-soft space-y-3"><p className="text-sm">Abandonner ce brouillon ? Son texte et ses imports non publiés seront supprimés.</p><button type="button" onClick={()=>setDiscard(false)} className="p-2 text-sm font-bold">Continuer la rédaction</button><button type="button" onClick={onClose} className="p-2 text-sm text-rose-500">Abandonner le brouillon</button></section>}
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-950 border border-rose-800/80 text-rose-400">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink tracking-tight">
                {step === 'select_place' && 'Valider votre présence'}
                {step === 'verifying' && 'Contrôle serveur en cours...'}
                {step === 'result' && (verificationResult?.success ? 'Check-in confirmé !' : 'Vérification refusée')}
                {step === 'optional_post' && 'Partager votre expérience (Optionnel)'}
                {step === 'propose_place' && 'Proposer un lieu manquant'}
              </h2>
              <span className="text-[11px] text-muted">
                {activeLocationMode === 'simulation' ? 'Simulation GPS · données fictives' : 'Position GPS · Abidjan'}
              </span>
            </div>
          </div>

          <button
            onClick={requestClose} disabled={publishing||mediaBusy} aria-label="Fermer le check-in"
            className="p-2 text-muted hover:text-ink rounded-full bg-soft/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: Select Place & Audience */}
        {step === 'select_place' && (
          <div className="pt-4 space-y-4">
            
            {currentPlace && events.some(event=>event.placeId===currentPlace.id&&Date.parse(event.utcDate)<=Date.now()&&Date.parse(event.endsAt||'')>=Date.now()) && <label className="block text-xs font-semibold">Événement au même lieu (facultatif)<select value={eventId} onChange={event=>setEventId(event.target.value)} className="block w-full mt-2 p-2 rounded-xl border border-line bg-canvas text-ink"><option value="">Visite du lieu uniquement</option>{events.filter(event=>event.placeId===currentPlace.id&&Date.parse(event.utcDate)<=Date.now()&&Date.parse(event.endsAt||'')>=Date.now()).map(event=><option key={event.id} value={event.id}>{event.title}</option>)}</select></label>}
            {/* GPS Status pill */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas/80 border border-line text-xs">
              <div className="flex items-center gap-2 text-body">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  Position : {userCurrentCoordinates.lat.toFixed(4)}, {userCurrentCoordinates.lng.toFixed(4)}
                </span>
              </div>
              <span className="text-[10px] text-muted font-medium">
                {activeLocationMode === 'simulation' ? 'Simulateur Cocody' : 'GPS Réel'}
              </span>
            </div>

            {/* List of nearby candidate places */}
            <div>
              <label className="text-xs font-semibold text-body mb-2 block">
                Sélectionnez le lieu où vous vous trouvez :
              </label>
              
              <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
                {sortedPlaces.map(place => {
                  const isEligible = place.distance <= DEFAULT_CHECKIN_RADIUS_METERS;
                  const isSelected = selectedPlaceId === place.id;

                  return (
                    <button
                      key={place.id}
                      onClick={() => {setSelectedPlaceId(place.id);setEventId('');}}
                      aria-pressed={isSelected}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-rose-950/50 border-rose-700/80 shadow-md ring-1 ring-rose-500'
                          : 'bg-canvas/60 border-line/80 hover:border-line-strong'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <SafeImage
                          src={place.coverImage}
                          alt={place.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-ink">{place.name}</span>
                            {place.verificationStatus === 'verified' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Vérifié"></span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted mt-0.5">
                            {place.categoryLabel} · {place.neighborhood} ({place.commune})
                          </div>
                        </div>
                      </div>

                      {/* Distance indicator */}
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-mono font-bold ${
                          isEligible ? 'text-emerald-400' : 'text-muted'
                        }`}>
                          {place.distance > 1000 ? `${(place.distance / 1000).toFixed(1)} km` : `${place.distance} m`}
                        </span>
                        <div className="text-[9px] text-muted">
                          {isEligible ? 'À portée' : 'Hors rayon'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Missing place proposal trigger */}
              <button
                onClick={() => setStep('propose_place')}
                className="mt-2.5 w-full py-2 px-3 border border-dashed border-line-strong hover:border-blue-500 rounded-xl text-xs text-blue-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Le lieu n'est pas dans la liste ? Proposer ce spot</span>
              </button>
            </div>

            {/* Audience Privacy Setting */}
            <div className="space-y-1.5 pt-2 border-t border-line">
              <label className="text-xs font-semibold text-body">
                Visibilité du check-in :
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAudience('private')}
                  className={`p-2.5 rounded-xl border text-center transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                    audience === 'private'
                      ? 'bg-blue-950/70 border-blue-500 text-ink font-semibold'
                      : 'bg-canvas border-line text-muted hover:text-body'
                  }`}
                >
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px]">Moi uniquement</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAudience('followers')}
                  className={`p-2.5 rounded-xl border text-center transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                    audience === 'followers'
                      ? 'bg-blue-950/70 border-blue-500 text-ink font-semibold'
                      : 'bg-canvas border-line text-muted hover:text-body'
                  }`}
                >
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px]">Abonnés</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAudience('public')}
                  className={`p-2.5 rounded-xl border text-center transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                    audience === 'public'
                      ? 'bg-blue-950/70 border-blue-500 text-ink font-semibold'
                      : 'bg-canvas border-line text-muted hover:text-body'
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px]">Public</span>
                </button>
              </div>

              <p className="text-[10px] text-muted pt-1">
                🔒 Vos coordonnées GPS de preuve ne sont jamais exposées publiquement.
              </p>
            </div>

            {/* Confirm check-in CTA */}
            <div className="pt-2">
              <button
                onClick={handleExecuteCheckIn}
                disabled={!currentPlace || isVerifying}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Crosshair className="w-4 h-4" />
                <span>Confirmer le check</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Verifying */}
        {step === 'verifying' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
              <Crosshair className="w-5 h-5 text-ink absolute" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Vérification de présence en cours</h3>
              <p className="text-xs text-muted max-w-xs mx-auto mt-1">
                Nous vérifions le lieu choisi. Une seule visite est comptée par jour et par lieu.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Verification Result */}
        {step === 'result' && verificationResult && (
          <div className="pt-4 space-y-5 text-center">
            {verificationResult.success ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/80 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink tracking-tight">
                    {verificationResult.recovered?'Visite déjà enregistrée':verificationResult.checkIn?.isSimulated ? 'Visite simulée enregistrée !' : 'Visite vérifiée avec succès !'}
                  </h3>
                  <p className="text-xs text-emerald-300 font-medium mt-1">
                    {verificationResult.message}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/70 border border-rose-800/80 rounded-lg text-rose-200 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      <span>{verificationResult.recovered?'Aucun nouveau point : visite déjà comptabilisée':`+${verificationResult.earnedXp} XP crédités au profil`}</span>
                    </div>

                    {verificationResult.unlockedBadgeName && (
                      <div className="reward-card w-full mt-3 p-5 rounded-3xl border border-line">
                        <div className="reward-medal mx-auto mb-4"><BrandSymbol className="w-20 h-20" /></div>
                        <p className="text-sm font-bold text-ink">Nouveau Badge débloqué : {verificationResult.unlockedBadgeName} !</p>
                        <p className="text-xs text-muted mt-1">{badges.find(badge => badge.name === verificationResult.unlockedBadgeName)?.family}</p>
                      </div>
                    )}
                  </div>
                </div>

                {verificationResult.checkIn?.placeId === 'plc_maquis_etoile' && <p className="text-xs text-blue-400">Récompense fictive débloquée : retrouve-la dans Profil.</p>}
                <div className="p-3 bg-canvas/80 border border-line rounded-xl text-left text-xs text-body space-y-1">
                  <p className="font-semibold text-ink">{activeLocationMode === 'simulation' ? 'Démonstration — visite fictive comptabilisée.' : 'Votre visite est comptabilisée.'}</p>
                  <p className="text-[11px] text-muted">
                    Aucune publication automatique n'est imposée. Souhaitez-vous partager une photo ou votre avis avec vos abonnés ?
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-soft hover:bg-raised text-body font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Plus tard (Terminer)
                  </button>
                  <button
                    onClick={() => {setPostAudience(verificationResult.checkIn?.audience||audience);setStep('optional_post');}}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Créer une publication</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-950/80 border-2 border-rose-500/80 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/60">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink tracking-tight">
                    {verificationResult.uncertain?'Résultat à vérifier':'Présence non confirmée'}
                  </h3>
                  <p className="text-xs text-rose-300 font-medium mt-1">
                    {verificationResult.message}
                  </p>
                </div>

                <div className="p-3.5 bg-canvas/90 border border-line rounded-xl text-left text-xs text-body space-y-1">
                  <span className="font-semibold text-ink">Règle de sécurité CHKPT :</span>
                  <p className="text-[11px] text-muted">
                    Seuls les check-ins effectués à moins de {DEFAULT_CHECKIN_RADIUS_METERS}m du lieu physique peuvent être vérifiés. Vous pouvez utiliser le sélecteur GPS en haut pour tester un spot à Cocody.
                  </p>
                </div>

                {verificationResult.uncertain&&<button type="button" disabled={isVerifying} onClick={async()=>{if(!currentPlace)return;setIsVerifying(true);const result=await recoverCheckIn(currentPlace.id);setVerificationResult(result);setIsVerifying(false);}} className="w-full p-3 bg-blue-600 text-white rounded-xl text-sm disabled:opacity-50">{isVerifying?'Vérification…':'Vérifier l’enregistrement'}</button>}
                <button
                  onClick={() => setStep('select_place')}
                  className="w-full py-3 bg-soft hover:bg-raised text-ink font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Réessayer avec un autre lieu
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Optional Follow-up Post Creation */}
        {step === 'optional_post' && currentPlace && (
          <form onSubmit={handlePublishFollowupPost} className="pt-4 space-y-4">
            <div className="p-3 rounded-xl bg-canvas/80 border border-line flex items-center gap-3">
              <SafeImage
                src={currentPlace.coverImage}
                alt={currentPlace.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-ink block">{currentPlace.name}</span>
                <span className="text-[11px] text-emerald-400 font-medium">{verificationResult?.checkIn?.isSimulated ? 'Visite simulée attachée · démo' : '✓ Visite vérifiée attachée'}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-body block mb-1">
                Votre commentaire ou avis :
              </label>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Racontez votre expérience, l'ambiance, les plats..."
                rows={3}
                className="w-full bg-canvas border border-line rounded-xl p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-rose-500"
              />
            </div>

            <AudienceSelect value={postAudience} onChange={setPostAudience} disabled={publishing}/>
            <PostMediaUploader disabled={publishing} value={postMedia} onChange={setPostMedia} onBusy={setMediaBusy} />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-soft hover:bg-raised text-body font-semibold text-xs rounded-xl cursor-pointer"
              >
                Passer
              </button>
              <button
                type="submit"
                disabled={mediaBusy || publishing}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Publier le checkpoint
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Missing Place Proposal */}
        {step === 'propose_place' && (
          <div className="pt-4 space-y-4">
            {proposalSent ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-ink">Proposition transmise à l’équipe</h3>
                <p className="text-xs text-muted max-w-xs mx-auto">
                  Votre proposition a été enregistrée avec vos coordonnées actuelles. L'équipe d'exploitation l'examinera dans la console d'administration.
                </p>
                <button
                  onClick={() => {
                    setProposalSent(false);
                    setStep('select_place');
                  }}
                  className="px-4 py-2 bg-soft text-ink text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Retour aux check-ins
                </button>
              </div>
            ) : (
              <form onSubmit={handleProposeNewPlace} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-body block mb-1">
                    Nom du lieu : *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                    placeholder="Ex: Maquis Le Bon Vivant"
                    className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-body block mb-1">
                      Catégorie :
                    </label>
                    <select
                      value={newPlaceCategory}
                      onChange={(e) => setNewPlaceCategory(e.target.value)}
                      className="w-full bg-canvas border border-line rounded-xl px-2.5 py-2 text-xs text-ink focus:outline-none"
                    >
                      <option value="restaurants">Restaurant</option>
                      <option value="cafes_boulangeries">Café / Pâtisserie</option>
                      <option value="bars_lounges">Bar & Lounge</option>
                      <option value="maquis">Maquis & Grillades</option>
                      <option value="culture_art">Culture & Art</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-body block mb-1">
                      Commune :
                    </label>
                    <select
                      value={newPlaceCommune}
                      onChange={(e) => setNewPlaceCommune(e.target.value)}
                      className="w-full bg-canvas border border-line rounded-xl px-2.5 py-2 text-xs text-ink focus:outline-none"
                    >
                      <option value="Cocody">Cocody</option>
                      <option value="Plateau">Plateau</option>
                      <option value="Marcory">Marcory</option>
                      <option value="Yopougon">Yopougon</option>
                      <option value="Treichville">Treichville</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-body block mb-1">
                    Repère / Précision d'accès :
                  </label>
                  <input
                    type="text"
                    value={newPlaceLandmark}
                    onChange={(e) => setNewPlaceLandmark(e.target.value)}
                    placeholder="Ex: Carrefour Saint-Jean, face pharmacie"
                    className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-xs text-ink focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('select_place')}
                    className="flex-1 py-2.5 bg-soft text-body font-semibold text-xs rounded-xl cursor-pointer"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Envoyer la proposition
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </dialog>
  );
};
