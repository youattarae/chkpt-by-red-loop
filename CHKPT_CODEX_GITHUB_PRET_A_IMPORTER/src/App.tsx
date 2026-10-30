import {EventDialog} from './components/events/EventDialog';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT by RED LOOP — Main Application Shell
 */

import {StoriesProvider} from './components/stories/Stories';
import { OtherProfile } from './components/profile/OtherProfile';
import { BusinessPreview } from './components/demo/BusinessPreview';
import { Welcome } from './components/demo/Welcome';
import React, { useEffect, useState } from 'react';
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
  const { isOperatorView, setIsOperatorView, places, currentUser, syncError, refreshSharedData, dismissToastNotification } = useStore();

  const [restoreNotice]=useState(()=>{const notice=sessionStorage.getItem('chkpt_restore_notice')||'';sessionStorage.removeItem('chkpt_restore_notice');return notice;});
  const [activeTab, setActiveTab] = useState<MainTab>('feed');
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [selectedPlaceIdForDetail, setSelectedPlaceIdForDetail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBadgesViewOpen, setIsBadgesViewOpen] = useState(false);
  const [eventId,setEventId]=useState<string|null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  useEffect(()=>{setIsCheckinOpen(false);},[currentUser.id]);

  useEffect(() => {
    const openSharedPlace = () => {
      const id = new URLSearchParams(window.location.hash.slice(1)).get('lieu');
      setSelectedPlaceIdForDetail(id && places.some(place => place.id === id) ? id : null);
    };
    openSharedPlace();
    window.addEventListener('hashchange', openSharedPlace);
    return () => window.removeEventListener('hashchange', openSharedPlace);
  }, [places]);
  const closePlace = () => {
    setSelectedPlaceIdForDetail(null);
    if (new URLSearchParams(window.location.hash.slice(1)).has('lieu')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  useEffect(() => {
    const open = (event: Event) => {
      const id = (event as CustomEvent).detail;
      if (typeof id !== 'string') return;
      if (id === currentUser.id) { setProfileId(null); setActiveTab('profile'); }
      else setProfileId(id);
    };
    window.addEventListener('chkpt:profile', open);
    return () => window.removeEventListener('chkpt:profile', open);
  }, [currentUser.id]);

  useEffect(()=>{const open=(event:Event)=>{if(typeof (event as CustomEvent).detail==='string')setEventId((event as CustomEvent).detail);};window.addEventListener('chkpt:event',open);return()=>window.removeEventListener('chkpt:event',open);},[]);

  const selectedPlace = places.find(p => p.id === selectedPlaceIdForDetail) || null;


  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-rose-900 selection:text-white">
      
      <div className="demo-ribbon"><span className="demo-dot" /> Mode démonstration · données fictives</div>
      {/* Contractual Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onGoHome={() => { setBusinessOpen(false); setProfileId(null); dismissToastNotification(); setIsOperatorView(false); setIsBadgesViewOpen(false); setActiveTab('feed'); }}
      />

      {/* In-App Toast Notification */}
      <InAppNotificationToast />

      {restoreNotice && <p role="status" className="p-3 text-xs text-blue-400 bg-soft">{restoreNotice}</p>}
      {syncError && <div role="alert" className="max-w-2xl mx-auto w-full p-3 text-xs text-rose-400 bg-soft border border-line rounded-xl">{syncError}<button type="button" onClick={()=>void refreshSharedData()} className="ml-2 underline cursor-pointer">Réessayer la synchronisation</button></div>}
      <Welcome visible={activeTab === 'feed' && !isOperatorView} />
      {/* Main View Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {businessOpen ? <BusinessPreview onClose={() => { setBusinessOpen(false); setActiveTab('profile'); }} /> : isOperatorView ? (
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
            setBusinessOpen(false);
            setActiveTab(tab);
            setIsBadgesViewOpen(false);
          }}
          onOpenCheckin={() => {
            setIsCheckinOpen(true);
          }}
        />
      )}

      {/* Modals & Dialogs */}
      {eventId&&<EventDialog id={eventId} onClose={()=>setEventId(null)}/>}
      {profileId && <OtherProfile key={`${currentUser.id}:${profileId}`} id={profileId} onClose={() => setProfileId(null)} onSelectPlace={setSelectedPlaceIdForDetail} />}
      {isCheckinOpen && <CheckinModal
        isOpen={isCheckinOpen}
        onClose={() => {
          setIsCheckinOpen(false);
        }}
        onPostPublishedSuccess={() => { dismissToastNotification(); setActiveTab('feed'); }}
      />}

      <PlaceDetailModal
        key={selectedPlace?.id || 'no-place'}
        place={selectedPlace}
        onClose={closePlace}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <SettingsModal onOpenBusiness={() => setBusinessOpen(true)} isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoriesProvider><AppContent /></StoriesProvider>
    </StoreProvider>
  );
}
