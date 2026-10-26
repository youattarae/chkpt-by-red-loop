import { SafeImage } from './SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Contractual Header Component for CHKPT & RED LOOP
 */

import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { ABIDJAN_TEST_LOCATIONS } from '../../services/geoService';
import { 
  MapPin, 
  Bell, 
  Shield, 
  Crosshair, 
  ChevronDown, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenAuth }) => {
  const { 
    currentUser, 
    selectedZone, 
    setSelectedZone, 
    activeLocationMode, 
    setActiveLocationMode,
    currentSimulatedSpot,
    setCurrentSimulatedSpot,
    isOperatorView,
    setIsOperatorView,
    unreadNotificationsCount,
    appEnvironment
  } = useStore();

  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const zones = ['Cocody', 'Plateau', 'Marcory'];
  const isOperator = ['admin', 'superadmin', 'moderator'].includes(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 px-3 sm:px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Brand Logo & Commune Selector */}
        <div className="flex items-center gap-2.5">
          {/* Logo Géométrique de passage CHKPT */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsOperatorView(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-900 via-rose-950 to-blue-950 border border-rose-700/60 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xs tracking-tighter">CP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white leading-none">
                CHKPT
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-rose-500 uppercase">
                by RED LOOP
              </span>
            </div>
          </div>

          {/* Sélecteur de Commune */}
          <div className="relative">
            <button
              onClick={() => {
                setShowZoneDropdown(!showZoneDropdown);
                setShowLocationDropdown(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{selectedZone}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showZoneDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
                {zones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => {
                      setSelectedZone(zone);
                      setShowZoneDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedZone === zone ? 'text-rose-400 bg-rose-950/40 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: GPS Simulator/Pill, Notification Bell & User Avatar */}
        <div className="flex items-center gap-2">
          
          {/* GPS Simulation / Browser Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowZoneDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Simulateur de position GPS pour la démo"
            >
              <Crosshair className={`w-3.5 h-3.5 ${activeLocationMode === 'simulation' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline truncate max-w-[110px]">
                {activeLocationMode === 'simulation' ? currentSimulatedSpot.name.split(' ')[0] : 'GPS Actif'}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${activeLocationMode === 'simulation' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            </button>

            {showLocationDropdown && (
              <div className="absolute top-full right-0 mt-1.5 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800">
                  Mode de Géolocalisation
                </div>
                
                <div className="grid grid-cols-2 gap-1 py-1.5 border-b border-slate-800">
                  <button
                    onClick={() => {
                      setActiveLocationMode('simulation');
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      activeLocationMode === 'simulation'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Simulateur
                  </button>
                  <button
                    onClick={() => {
                      setActiveLocationMode('browser_gps');
                      setShowLocationDropdown(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      activeLocationMode === 'browser_gps'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    GPS Réel
                  </button>
                </div>

                {activeLocationMode === 'simulation' && (
                  <div className="pt-1.5 space-y-1">
                    <div className="text-[10px] text-slate-400 px-2">Positions Cocody & Abidjan :</div>
                    {ABIDJAN_TEST_LOCATIONS.map((spot) => (
                      <button
                        key={spot.id}
                        onClick={() => {
                          setCurrentSimulatedSpot(spot);
                          setSelectedZone(spot.commune);
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex flex-col ${
                          currentSimulatedSpot.id === spot.id
                            ? 'bg-rose-950/60 text-white font-bold border border-rose-800/60'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{spot.name}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{spot.commune}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Operator Console Toggle (Only visible if user is operator/admin) */}
          {isOperator && (
            <button
              onClick={() => setIsOperatorView(!isOperatorView)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isOperatorView
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Console Opérateur RED LOOP (M01-M14)"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {/* Notification Center Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar & Switcher Modal trigger */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            title="Profil & Compte Démo"
          >
            <SafeImage
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-6 h-6 rounded-lg object-cover"
            />
            <span className="text-[11px] font-bold text-white pr-1 hidden sm:inline">
              Niv. {currentUser.level}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
