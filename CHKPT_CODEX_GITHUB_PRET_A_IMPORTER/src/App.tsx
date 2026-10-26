/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT by RED LOOP — Main Application Shell
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './services/store';
import { Header } from './components/common/Header';
import { BottomNav, MainTab } from './components/common/BottomNav';
import { InAppNotificationToast } from './components/common/InAppNotificationToast';
import { NotificationCenterModal } from './components/common/NotificationCenterModal';
import { AuthModal } from './components/auth/AuthModal';
import { CheckinModal } from './components/checkin/CheckinModal';
import { PlaceDetailModal } from './components/places/PlaceDetailModal';
import { FeedView } from './components/feed/FeedView';
import { MapView } from './components/map/MapView';
import { SortirView } from './components/sortir/SortirView';
import { ProfileView } from './components/profile/ProfileView';
import { BadgesView } from './components/badges/BadgesView';
import { OperatorConsole } from './components/operator/OperatorConsole';

const AppContent: React.FC = () => {
  const { isOperatorView, places, dismissToastNotification } = useStore();

  const [activeTab, setActiveTab] = useState<MainTab>('feed');
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [selectedPlaceIdForDetail, setSelectedPlaceIdForDetail] = useState<string | null>(null);
  const [preselectedPlaceIdForCheckin, setPreselectedPlaceIdForCheckin] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBadgesViewOpen, setIsBadgesViewOpen] = useState(false);

  const selectedPlace = places.find(p => p.id === selectedPlaceIdForDetail) || null;

  const handleOpenCheckinWithPlace = (placeId: string) => {
    setPreselectedPlaceIdForCheckin(placeId);
    setIsCheckinOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-900 selection:text-white">
      
      <div className="demo-ribbon"><span className="demo-dot" /> Mode démonstration · données fictives</div>
      {/* Contractual Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* In-App Toast Notification */}
      <InAppNotificationToast />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {isOperatorView ? (
          <OperatorConsole />
        ) : isBadgesViewOpen ? (
          <BadgesView onBack={() => setIsBadgesViewOpen(false)} />
        ) : (
          <>
            {activeTab === 'feed' && (
              <FeedView
                onSelectPlace={(id) => setSelectedPlaceIdForDetail(id)}
                onOpenCheckin={() => {
                  setPreselectedPlaceIdForCheckin(null);
                  setIsCheckinOpen(true);
                }}
              />
            )}

            {activeTab === 'map' && (
              <MapView
                onSelectPlace={(id) => setSelectedPlaceIdForDetail(id)}
                onOpenCheckinHere={handleOpenCheckinWithPlace}
              />
            )}

            {activeTab === 'sortir' && (
              <SortirView
                onSelectPlace={(id) => setSelectedPlaceIdForDetail(id)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                onOpenBadges={() => setIsBadgesViewOpen(true)}
                onSelectPlace={(id) => setSelectedPlaceIdForDetail(id)}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Contractual 5-Tab Bottom Navigation */}
      {!isOperatorView && !isBadgesViewOpen && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            dismissToastNotification();
            setActiveTab(tab);
            setIsBadgesViewOpen(false);
          }}
          onOpenCheckin={() => {
            setPreselectedPlaceIdForCheckin(null);
            setIsCheckinOpen(true);
          }}
        />
      )}

      {/* Modals & Dialogs */}
      {isCheckinOpen && <CheckinModal
        key={preselectedPlaceIdForCheckin || "nearby"}
        isOpen={isCheckinOpen}
        onClose={() => {
          setIsCheckinOpen(false);
          setPreselectedPlaceIdForCheckin(null);
        }}
        preselectedPlaceId={preselectedPlaceIdForCheckin}
        onPostPublishedSuccess={() => { dismissToastNotification(); setActiveTab('feed'); }}
      />}

      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlaceIdForDetail(null)}
        onCheckinHere={handleOpenCheckinWithPlace}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
