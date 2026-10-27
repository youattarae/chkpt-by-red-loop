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
import { SettingsModal } from './components/common/SettingsModal';

const AppContent: React.FC = () => {
  const { isOperatorView, setIsOperatorView, places, dismissToastNotification } = useStore();

  const [activeTab, setActiveTab] = useState<MainTab>('feed');
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [selectedPlaceIdForDetail, setSelectedPlaceIdForDetail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBadgesViewOpen, setIsBadgesViewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const selectedPlace = places.find(p => p.id === selectedPlaceIdForDetail) || null;


  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-rose-900 selection:text-white">
      
      <div className="demo-ribbon"><span className="demo-dot" /> Mode démonstration · données fictives</div>
      {/* Contractual Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onGoHome={() => { dismissToastNotification(); setIsOperatorView(false); setIsBadgesViewOpen(false); setActiveTab('feed'); }}
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

              />
            )}

            {activeTab === 'map' && (
              <MapView
                onSelectPlace={(id) => setSelectedPlaceIdForDetail(id)}
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
                onOpenSettings={() => { dismissToastNotification(); setIsSettingsOpen(true); }}
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
            setIsCheckinOpen(true);
          }}
        />
      )}

      {/* Modals & Dialogs */}
      {isCheckinOpen && <CheckinModal
        isOpen={isCheckinOpen}
        onClose={() => {
          setIsCheckinOpen(false);
        }}
        onPostPublishedSuccess={() => { dismissToastNotification(); setActiveTab('feed'); }}
      />}

      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlaceIdForDetail(null)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

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
