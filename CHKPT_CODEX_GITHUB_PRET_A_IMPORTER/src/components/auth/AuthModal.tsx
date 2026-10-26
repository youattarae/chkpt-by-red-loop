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
    currentUser, 
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
    finally { setIsLoading(false); }
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
      setIsResetting(false);
    }
  };

  const numAge = parseInt(age, 10) || 20;
  const isMinor = numAge >= 13 && numAge <= 17;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-950 flex items-center justify-center border border-blue-500/30">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Compte & Environnement</h3>
              <p className="text-xs text-slate-400">Contrôle de session & scénario de pitch</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-2.5 text-xs text-amber-300">
          Prototype de démonstration — données fictives
        </div>
        <p className="px-4 pt-2 text-[11px] text-slate-400">
          Les profils et la réinitialisation nécessitent une démo privée activée sur le serveur
          et une connexion opérateur.
        </p>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => { setTab('switch_demo'); setErrorMsg(null); }}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
              tab === 'switch_demo' ? 'border-rose-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Profils Démo (opérateur)
          </button>
          <button
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
              tab === 'login' ? 'border-rose-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
              tab === 'register' ? 'border-rose-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
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
            <p className="text-xs text-slate-400 leading-relaxed">
              Basculez entre les comptes de démonstration pour tester les rôles et permissions :
            </p>

            <button
              onClick={() => handleSwitchDemo('koffi_urbex')}
              disabled={isLoading}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                currentUser.username === 'koffi_urbex'
                  ? 'bg-blue-950/60 border-blue-600/70 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <SafeImage
                  src="/illustrations/koffi.svg"
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Koffi Kouamé</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                      Utilisateur normal
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">@koffi_urbex · Niv. {currentUser.level} · Cocody</span>
                </div>
              </div>
              {currentUser.username === 'koffi_urbex' && (
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              )}
            </button>

            <button
              onClick={() => handleSwitchDemo('sarah_dlo')}
              disabled={isLoading}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                currentUser.username === 'sarah_dlo'
                  ? 'bg-blue-950/60 border-blue-600/70 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <SafeImage
                  src="/illustrations/sarah.svg"
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Sarah Diallo</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                      Abonnée confirmée
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">@sarah_dlo · 512 abonnés · Cocody</span>
                </div>
              </div>
              {currentUser.username === 'sarah_dlo' && (
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              )}
            </button>

            <button
              onClick={() => handleSwitchDemo('redloop_admin')}
              disabled={isLoading}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                currentUser.username === 'redloop_admin'
                  ? 'bg-rose-950/60 border-rose-600/70 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-950 flex items-center justify-center border border-rose-500/40">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Superviseur RED LOOP</span>
                    <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">
                      Rôle Opérateur / Admin
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Accès exclusif console M01–M14</span>
                </div>
              </div>
              {currentUser.username === 'redloop_admin' && (
                <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </button>

            {['admin', 'superadmin', 'moderator'].includes(currentUser.role) && (
              <button onClick={handleStartPitch} disabled={isLoading}
                className="w-full py-3 bg-blue-500 text-slate-950 rounded-xl font-bold text-sm">
                Démarrer la démo
              </button>
            )}
            {/* Reset Pitch Button */}
            <div className="pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetPitch}
                disabled={isResetting}
                className="w-full py-2.5 px-3 bg-slate-950 hover:bg-rose-950/40 text-rose-300 hover:text-white border border-dashed border-rose-800/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>Réinitialiser le scénario Pitch (Démo vierge)</span>
              </button>
              <span className="block text-[10px] text-slate-400 text-center mt-1">
                Remet à zéro les check-ins d'aujourd'hui, le fil et les points pour rejouer le scénario.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Connexion */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="p-4 sm:p-5 space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Identifiant / Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: koffi_urbex"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Nom d'affichage</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ex: Yao Koffi"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nom d'utilisateur (@)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: yao_abidjan"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Âge</label>
                <input
                  type="number"
                  min="13"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Zone</label>
                <input
                  type="text"
                  value={homeZone}
                  onChange={(e) => setHomeZone(e.target.value)}
                  placeholder="Cocody"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Mot de passe (min 6 car.)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer mon compte</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
