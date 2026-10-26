import { SafeImage } from '../common/SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RED LOOP Operator Console (Surfaces M01 to M14)
 * Reserved for admin & moderator roles
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../../services/store';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Check, 
  X, 
  BarChart3, 
  Layers, 
  RefreshCw,
  Users
} from 'lucide-react';

export const OperatorConsole: React.FC = () => {
  const { 
    currentUser, 
    places, 
    placeProposals, 
    approveProposal, 
    rejectProposal,
    moderationCases,
    resolveModerationCase,
    togglePlaceVerification,
    authSessionToken
  } = useStore();

  const [activeTab, setActiveTab] = useState<'metrics' | 'proposals' | 'moderation' | 'places'>('metrics');
  const [serverMetrics, setServerMetrics] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, [authSessionToken]);

  const fetchMetrics = () => {
    setLoadingMetrics(true);
    fetch('/api/admin/metrics', {
      headers: { Authorization: `Bearer ${authSessionToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) setServerMetrics(data.metrics);
      })
      .catch((err) => console.warn('Could not fetch operator metrics:', err))
      .finally(() => setLoadingMetrics(false));
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-5 space-y-5 pb-24">
      
      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-800/80 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-900 border border-rose-600 text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                Console d'Exploitation RED LOOP
              </h2>
              <span className="text-[11px] text-slate-400">
                Opérateur : {currentUser.displayName} ({currentUser.role})
              </span>
            </div>
          </div>

          <button
            onClick={fetchMetrics}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Rafraîchir les métriques"
          >
            <RefreshCw className={`w-4 h-4 ${loadingMetrics ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 text-xs font-bold bg-slate-950/60 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'metrics' ? 'bg-rose-900 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Métriques
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`flex-1 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'proposals' ? 'bg-rose-900 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Propositions ({placeProposals.filter(p => p.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex-1 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'moderation' ? 'bg-rose-900 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Modération ({moderationCases.filter(c => c.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('places')}
          className={`flex-1 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'places' ? 'bg-rose-900 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lieux ({places.length})
        </button>
      </div>

      {/* Tab 1: Metrics */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
            <span className="text-slate-400 block mb-1">Total Utilisateurs</span>
            <span className="text-2xl font-bold text-white font-mono">
              {serverMetrics?.totalUsers || 3}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1">Actifs Abidjan</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
            <span className="text-slate-400 block mb-1">Lieux Référencés</span>
            <span className="text-2xl font-bold text-white font-mono">
              {serverMetrics?.totalPlaces || places.length}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1">Certifiés RED LOOP</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
            <span className="text-slate-400 block mb-1">Visites Vérifiées</span>
            <span className="text-2xl font-bold text-rose-400 font-mono">
              {serverMetrics?.totalVerifiedCheckins || 1}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">Preuves serveur isolées</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
            <span className="text-slate-400 block mb-1">Signalements En Attente</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">
              {serverMetrics?.pendingReports || 0}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">File M05</span>
          </div>
        </div>
      )}

      {/* Tab 2: Proposals */}
      {activeTab === 'proposals' && (
        <div className="space-y-3">
          {placeProposals.map((prp) => (
            <div
              key={prp.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">{prp.name}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  prp.status === 'accepted' ? 'bg-emerald-950 text-emerald-300' :
                  prp.status === 'rejected' ? 'bg-rose-950 text-rose-300' :
                  'bg-amber-950 text-amber-300'
                }`}>
                  {prp.status}
                </span>
              </div>

              <div className="text-slate-400 space-y-0.5">
                <p>Commune : {prp.commune} · Catégorie : {prp.category}</p>
                <p>Adresse : {prp.address}</p>
                <p>Repère : {prp.landmark}</p>
                <p className="text-[10px]">Contributeur : {prp.contributorName}</p>
              </div>

              {prp.status === 'pending' && (
                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => approveProposal(prp.id)}
                    className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approuver & Créer le lieu</span>
                  </button>
                  <button
                    onClick={() => rejectProposal(prp.id, 'Informations insuffisantes')}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Rejeter</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Moderation */}
      {activeTab === 'moderation' && (
        <div className="space-y-3">
          {moderationCases.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400">Signalement {c.targetType}</span>
                <span className="text-[10px] text-slate-400">{c.reportedAt}</span>
              </div>
              <p className="text-slate-300"><strong>Motif :</strong> {c.reportedReason}</p>
              <div className="p-2.5 bg-slate-950 rounded-xl text-slate-400 italic">
                "{c.snippet}"
              </div>
              {c.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => resolveModerationCase(c.id, 'resolved')}
                    className="flex-1 py-1.5 bg-rose-900 hover:bg-rose-800 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Sanctionner / Masquer
                  </button>
                  <button
                    onClick={() => resolveModerationCase(c.id, 'dismissed')}
                    className="flex-1 py-1.5 bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer"
                  >
                    Rejeter le signalement
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Certified Places */}
      {activeTab === 'places' && (
        <div className="space-y-2">
          {places.map((place) => (
            <div
              key={place.id}
              className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <SafeImage src={place.coverImage} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-white">{place.name}</h4>
                  <span className="text-[10px] text-slate-400">{place.commune} · {place.totalCheckins} check-ins</span>
                </div>
              </div>

              <button
                onClick={() => togglePlaceVerification(place.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                  place.verificationStatus === 'verified'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {place.verificationStatus === 'verified' ? 'Certifié ✓' : 'Non certifié'}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
