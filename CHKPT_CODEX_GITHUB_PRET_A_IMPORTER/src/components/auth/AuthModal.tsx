import {SimpleDialog} from '../common/SimpleDialog';
import {DEMO_PROFILES} from '../../data/demoProfiles';
import { SafeImage } from '../common/SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT by RED LOOP — Authentication & Session Modal (Lot P0-A)
 * Provides:
 *  - Real server registration & login with password verification
 *  - Automatic minor protection (13-17 forces private profile)
 *  - Clear Demo vs Production environment toggle
 *  - Fast persona switcher for evaluation (Koffi standard, Sarah follower, RED LOOP admin)
 *  - Instant Pitch Scenario Reset for repeat evaluations
 */

import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { 
  User, 
  Shield, 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, isServerAuthenticated,
    setCurrentUser, 
    setAuthSessionToken,
    authSessionToken,
    resetDemoPitchState,
  } = useStore();

  const [tab, setTab] = useState<'switch_demo' | 'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('22');
  const [homeZone, setHomeZone] = useState('Cocody, Abidjan');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetIntent,setResetIntent]=useState<'start'|'reset'|null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Identifiants invalides');
      }

      setAuthSessionToken(data.token);
      setCurrentUser(data.user);
      setSuccessMsg(`Bienvenue ${data.user.displayName} ! Session active.`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          displayName: displayName || username,
          password,
          age: parseInt(age, 10),
          homeZone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      setAuthSessionToken(data.token);
      setCurrentUser(data.user);
      setSuccessMsg(`Compte créé avec succès ! Bienvenue sur CHKPT.`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchDemo = async (targetUsername: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authSessionToken}` },
        body: JSON.stringify({ 
          username: targetUsername,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Impossible de basculer de profil');
      }

      setAuthSessionToken(data.token);
      setCurrentUser(data.user);
      setSuccessMsg(data.message);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPitch = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await resetDemoPitchState(true);
      onClose();
    } catch (err: any) { setErrorMsg(err.message); }
    finally { setIsLoading(false);setResetIntent(null); }
  };

  const handleResetPitch = async () => {
    setIsResetting(true);
    try {
      await resetDemoPitchState();
      setSuccessMsg('Scénario réinitialisé. Reconnectez-vous pour commencer la démo.');
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMsg('Erreur lors de la réinitialisation : ' + err.message);
    } finally {
      setIsResetting(false);setResetIntent(null);
    }
  };

  const numAge = parseInt(age, 10) || 20;
  const isMinor = numAge >= 13 && numAge <= 17;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-canvas/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-md shadow-2xl max-h-[90dvh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink tracking-tight">Compte & Environnement</h3>
              <p className="text-xs text-muted">Contrôle de session & scénario de pitch</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer le compte"
            className="p-2 text-muted hover:text-ink hover:bg-soft rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isServerAuthenticated && <button type="button" disabled={isLoading} onClick={async()=>{setIsLoading(true);try{await fetch('/api/auth/logout',{method:'POST',headers:{Authorization:`Bearer ${authSessionToken}`}});}catch{/* Clear this device even when the server is unreachable. */}finally{setAuthSessionToken('');setIsLoading(false);onClose();}}} className="mx-4 my-2 text-xs text-rose-400 underline cursor-pointer">Se déconnecter de cet appareil</button>}
        <div className="bg-canvas/80 border-b border-line/80 px-4 py-2.5 text-xs text-amber-300">
          Prototype de démonstration — données fictives
        </div>
        <p className="px-4 pt-2 text-[11px] text-muted">
          Les profils et la réinitialisation nécessitent une démo privée activée sur le serveur
          et une connexion opérateur.
        </p>

        {/* Tab Switcher */}
        <div className="flex border-b border-line bg-canvas/40 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => { setTab('switch_demo'); setErrorMsg(null); }}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
              tab === 'switch_demo' ? 'border-rose-500 text-ink' : 'border-transparent text-muted hover:text-body'
            }`}
          >
            Profils Démo (opérateur)
          </button>
          <button
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
              tab === 'login' ? 'border-rose-500 text-ink' : 'border-transparent text-muted hover:text-body'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
              tab === 'register' ? 'border-rose-500 text-ink' : 'border-transparent text-muted hover:text-body'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mx-4 mt-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-xs text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-4 mt-4 p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Switch Persona */}
        {tab === 'switch_demo' && (
          <div className="p-4 sm:p-5 space-y-3">
            <p className="text-xs text-muted leading-relaxed">
              Basculez entre les comptes de démonstration pour tester les rôles et permissions :
            </p>

            <button
              onClick={() => handleSwitchDemo('usr_01')}
              disabled={isLoading}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                currentUser.username === 'yacoub_ouattara'
                  ? 'bg-blue-950/60 border-blue-600/70 shadow-sm'
                  : 'bg-canvas/40 border-line hover:border-line-strong'
              }`}
            >
              <div className="flex items-center gap-3">
                <SafeImage
                  src="/illustrations/profil-koffi.webp"
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-line-strong"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">Yacoub Ouattara</span>
                    <span className="text-[10px] bg-soft text-body px-1.5 py-0.5 rounded border border-line-strong">
                      Utilisateur normal
                    </span>
                  </div>
                  <span className="text-xs text-muted">@yacoub_ouattara · Niv. {currentUser.level} · Cocody</span>
                </div>
              </div>
              {currentUser.username === 'yacoub_ouattara' && (
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              )}
            </button>

            <button
              onClick={() => handleSwitchDemo('usr_sarah')}
              disabled={isLoading}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                currentUser.username === 'ingrid_ngoan'
                  ? 'bg-blue-950/60 border-blue-600/70 shadow-sm'
                  : 'bg-canvas/40 border-line hover:border-line-strong'
              }`}
            >
              <div className="flex items-center gap-3">
                <SafeImage
                  src="/illustrations/profil-sarah.webp"
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-line-strong"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">Ingrid N’Goan</span>
                    <span className="text-[10px] bg-soft text-body px-1.5 py-0.5 rounded border border-line-strong">
                      Abonnée confirmée
                    </span>
                  </div>
                  <span className="text-xs text-muted">@ingrid_ngoan · 512 abonnés · Cocody</span>
                </div>
              </div>
              {currentUser.username === 'ingrid_ngoan' && (
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              )}
            </button>

            {DEMO_PROFILES.filter(profile=>['usr_02','usr_nadia'].includes(profile.id)).map(profile=><button type="button" key={profile.id} disabled={isLoading} onClick={()=>handleSwitchDemo(profile.id)} className="w-full p-3 rounded-2xl border border-line bg-canvas text-left flex gap-3 items-center"><SafeImage src={profile.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover"/><span><strong className="block text-sm">{profile.displayName}</strong><span className="block text-xs text-muted">@{profile.username} · profil fictif</span></span></button>)}

            <button
              onClick={() => handleSwitchDemo('redloop_admin')}
              disabled={isLoading}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                currentUser.username === 'redloop_admin'
                  ? 'bg-rose-950/60 border-rose-600/70 shadow-sm'
                  : 'bg-canvas/40 border-line hover:border-line-strong'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center border border-rose-500/40">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">Superviseur RED LOOP</span>
                    <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">
                      Rôle Opérateur / Admin
                    </span>
                  </div>
                  <span className="text-xs text-muted">Accès exclusif console M01–M14</span>
                </div>
              </div>
              {currentUser.username === 'redloop_admin' && (
                <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </button>

            {['admin', 'superadmin', 'moderator'].includes(currentUser.role) && (
              <button onClick={()=>setResetIntent('start')} disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm">
                Démarrer la démo
              </button>
            )}
            {/* Reset Pitch Button */}
            <div className="pt-3 border-t border-line">
              <button
                type="button"
                onClick={()=>setResetIntent('reset')}
                disabled={isResetting}
                className="w-full py-2.5 px-3 bg-canvas hover:bg-rose-950/40 text-rose-300 hover:text-ink border border-dashed border-rose-800/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>Réinitialiser le scénario Pitch (Démo vierge)</span>
              </button>
              <span className="block text-[10px] text-muted text-center mt-1">
                Efface tous les comptes et contenus ajoutés à cette base de démonstration. Une confirmation est requise.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Connexion */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="p-4 sm:p-5 space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-body mb-1">Identifiant / Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: yacoub_ouattara"
                required
                className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-ink placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-body mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-ink placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Se connecter</span>
            </button>
          </form>
        )}

        {/* Tab 3: Inscription */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="p-4 sm:p-5 space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-body mb-1">Nom d'affichage</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ex: Yao Koffi"
                className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-ink placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-body mb-1">Nom d'utilisateur (@)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: yao_abidjan"
                required
                className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-ink placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-body mb-1">Âge</label>
                <input
                  type="number"
                  min="13"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-body mb-1">Zone</label>
                <input
                  type="text"
                  value={homeZone}
                  onChange={(e) => setHomeZone(e.target.value)}
                  placeholder="Cocody"
                  className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {isMinor && (
              <div className="p-2.5 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-[11px] text-indigo-300 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Protection des mineurs (13–17 ans) : votre profil et vos check-ins seront configurés en <strong>mode privé par défaut</strong>.
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-body mb-1">Mot de passe (min 6 car.)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-ink placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer mon compte</span>
            </button>
          </form>
        )}

      </div>
      {resetIntent&&<SimpleDialog title="Remettre toute la démo à zéro ?" onClose={()=>{if(!isLoading&&!isResetting)setResetIntent(null);}}><p className="text-sm">Cette action supprime tous les comptes ajoutés, publications, médias, visites et points de cette base, puis rétablit les personnages fictifs. Elle est irréversible sans sauvegarde.</p><p className="mt-3 text-xs text-muted">Pour continuer votre démo actuelle, annulez. Vous pouvez changer de personnage sans réinitialiser. La sauvegarde chiffrée est disponible dans les réglages de l’opérateur.</p><div className="flex flex-wrap gap-3 mt-5"><button type="button" disabled={isLoading||isResetting} onClick={()=>setResetIntent(null)} className="p-3 rounded-xl bg-soft text-sm">Annuler</button><button type="button" disabled={isLoading||isResetting} onClick={()=>void (resetIntent==='start'?handleStartPitch():handleResetPitch())} className="p-3 rounded-xl bg-rose-700 text-white text-sm font-bold">{isLoading||isResetting?'Remise à zéro…':'Confirmer la remise à zéro'}</button></div></SimpleDialog>}
    </div>
  );
};
