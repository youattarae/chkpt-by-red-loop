import {BadgeFamilyPage} from './components/badges/BadgesView';
import {useRef} from 'react';
import {ExperienceProvider,useExperience} from './components/experience/Experience';
import {Composer} from './components/experience/Composer';
import {ComposerContext,openComposer,openCheck} from './components/experience/actions';
import {ShareSheet} from './components/experience/ShareSheet';
import {Sheet} from './components/experience/Sheet';
import {ActivityPage} from './components/experience/ActivityPage';
import {SavedPage} from './components/experience/SavedPage';
import {ArticlePage} from './components/experience/ArticlePage';
import {PublicationCard} from './components/common/PublicationCard';
import type {EntityRef} from '../shared/entities';
import {MessagesPage} from './components/messages/MessagesPage';
/** @license SPDX-License-Identifier: Apache-2.0 */
import {useEffect,useState} from 'react';
import {StoreProvider,useStore} from './services/store';
import {NavigationProvider,Route,useNavigation} from './navigation/Navigation';
import {StoriesProvider} from './components/stories/Stories';
import {Header} from './components/common/Header';
import {BottomNav,MainTab} from './components/common/BottomNav';
import {InAppNotificationToast} from './components/common/InAppNotificationToast';
import {NotificationCenterModal} from './components/common/NotificationCenterModal';
import {AuthModal} from './components/auth/AuthModal';
import {CheckinModal} from './components/checkin/CheckinModal';
import {SettingsModal} from './components/common/SettingsModal';
import {PlaceDetailModal} from './components/places/PlaceDetailModal';
import {FeedView} from './components/feed/FeedView';
import {MapView} from './components/map/MapView';
import {SortirView} from './components/sortir/SortirView';
import {ProfileView} from './components/profile/ProfileView';
import {OtherProfile} from './components/profile/OtherProfile';
import {ConnectionsDialog} from './components/profile/ConnectionsDialog';
import {ExplorerRanking} from './components/sortir/ExplorerRanking';
import {EventDialog} from './components/events/EventDialog';
import {OperatorConsole} from './components/operator/OperatorConsole';
import {BusinessPreview} from './components/demo/BusinessPreview';
import {Welcome} from './components/demo/Welcome';
import {SearchResultsPage} from './components/search/SearchExperience';
import {SideMenu} from './components/navigation/SideMenu';
import {PersonalPage} from './components/navigation/PersonalPage';
import {PageLayout} from './components/navigation/PageLayout';
function AppContent(){
 const {isOperatorView,setIsOperatorView,places,posts,currentUser,authSessionToken,isServerAuthenticated,sharedStateReady,syncError,refreshSharedData,dismissToastNotification}=useStore();const nav=useNavigation();const route=nav.current.route;const activeTab=route.tab;
 const operatorVisible=isOperatorView&&isServerAuthenticated&&['admin','superadmin','moderator'].includes(currentUser.role);
 const [restoreNotice]=useState(()=>{const notice=sessionStorage.getItem('chkpt_restore_notice')||'';sessionStorage.removeItem('chkpt_restore_notice');return notice;});
 const [checkin,setCheckin]=useState(false),[auth,setAuth]=useState(false),[notifications,setNotifications]=useState(false),[settings,setSettings]=useState(false),[menu,setMenu]=useState(false);
 const [welcomeTarget,setWelcomeTarget]=useState<HTMLDivElement|null>(null);
 const [feedHeaderHidden,setFeedHeaderHidden]=useState(false);const exp=useExperience();const [feedFilter,setFeedFilter]=useState<'for_you'|'friends'>('for_you');const [actions,setActions]=useState(false),[composer,setComposer]=useState<ComposerContext|null>(null),[share,setShare]=useState<EntityRef|null>(null),[checkPlace,setCheckPlace]=useState<string|undefined>();
 const [visited,setVisited]=useState<MainTab[]>([activeTab]);const tabs=Array.from(new Set([...visited,activeTab]));
 useEffect(()=>{setVisited(previous=>previous.includes(activeTab)?previous:[...previous,activeTab]);},[activeTab]);
 useEffect(()=>{setCheckin(false);setMenu(false);setFeedFilter('for_you');setNotifications(false);setActions(false);setComposer(null);setShare(null);setIsOperatorView(false);},[authSessionToken]);
 useEffect(()=>{setIsOperatorView(false);},[nav.current.key]);
 const place=(id:string)=>nav.push({page:'place',id,tab:activeTab});
 const profile=(id:string)=>{if(id===currentUser.id&&isServerAuthenticated)nav.push({page:'profile',id,tab:activeTab});else nav.push({page:'profile',id,tab:activeTab});};
 useEffect(()=>{const openProfile=(event:Event)=>{const id=(event as CustomEvent).detail;if(typeof id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(id))profile(id);};const openEvent=(event:Event)=>{const id=(event as CustomEvent).detail;if(typeof id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(id))nav.push({page:'event',id,tab:activeTab});};window.addEventListener('chkpt:profile',openProfile);window.addEventListener('chkpt:event',openEvent);return()=>{window.removeEventListener('chkpt:profile',openProfile);window.removeEventListener('chkpt:event',openEvent);};},[nav.current.key,currentUser.id,isServerAuthenticated]);
 useEffect(()=>{if(route.page==='main')return;const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!event.defaultPrevented&&!auth&&!checkin&&!settings&&!notifications&&!menu&&!document.querySelector('dialog[open], [aria-label="Réglages GPS"]')){event.preventDefault();nav.back();}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[nav.current.key,auth,checkin,settings,notifications,menu]);
 useEffect(()=>{const compose=(e:Event)=>{setActions(false);setCheckin(false);setShare(null);setComposer((e as CustomEvent).detail||{});};const check=(e:Event)=>{setCheckPlace((e as CustomEvent).detail||undefined);setActions(false);setCheckin(true);};const sharing=(e:Event)=>setShare((e as CustomEvent).detail);window.addEventListener('chkpt:compose',compose);window.addEventListener('chkpt:check',check);window.addEventListener('chkpt:share',sharing);return()=>{window.removeEventListener('chkpt:compose',compose);window.removeEventListener('chkpt:check',check);window.removeEventListener('chkpt:share',sharing);};},[]);
 const touch=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>{const start=(e:TouchEvent)=>{const t=e.touches[0];touch.current=t&&t.clientX<24&&!document.querySelector('dialog[open]')?{x:t.clientX,y:t.clientY}:null;};const end=(e:TouchEvent)=>{const t=e.changedTouches[0],from=touch.current;if(from&&t&&t.clientX-from.x>65&&Math.abs(t.clientY-from.y)<70)setMenu(true);touch.current=null;};window.addEventListener('touchstart',start,{passive:true});window.addEventListener('touchend',end,{passive:true});return()=>{window.removeEventListener('touchstart',start);window.removeEventListener('touchend',end);};},[]);
 const openAccount=()=>setAuth(true);const openSettings=()=>{dismissToastNotification();setSettings(true);};
 function secondary(page:Route,isVisible:boolean){
  switch(page.page){
   case 'main':return null;
   case 'place':{const found=places.find(place=>place.id===page.id);return found?<PlaceDetailModal place={found} onClose={nav.back}/>:<PageLayout title="Lieu indisponible" onBack={nav.back}><p>Ce lieu n’est pas disponible dans la démonstration.</p></PageLayout>;}
   case 'event':return <EventDialog id={page.id} onClose={nav.back}/>;
   case 'profile':if(page.id===currentUser.id)return <section className="max-w-2xl mx-auto"><ProfileView onOpenBadges={()=>nav.push({page:'progress',tab:activeTab})} onSelectPlace={place} onOpenAuth={openAccount} onOpenSettings={openSettings}/></section>;return <OtherProfile isVisible={isVisible} id={page.id} onClose={nav.back} onSelectPlace={place}/>;
   case 'followers':case 'following':return <ConnectionsDialog isVisible={isVisible} id={page.id} kind={page.page} onClose={nav.back}/>;
   case 'saved':return <SavedPage/>;
   case 'notifications':return <ActivityPage/>;
   case 'badge-family':return <BadgeFamilyPage id={page.id} onBack={nav.back} onAccount={openAccount}/>;
   case 'article':return <ArticlePage id={page.id}/>;
   case 'post':{const post=posts.find(p=>p.id===page.id);return <PageLayout title="Publication" onBack={nav.back}>{post?<PublicationCard post={post} onSelectPlace={place}/>:<p>Publication indisponible ou privée.</p>}</PageLayout>;}
   case 'messages':return <MessagesPage isVisible={isVisible}/>;
   case 'conversation':return <MessagesPage peerId={page.id} isVisible={isVisible}/>;
   case 'ranking':return <ExplorerRanking isVisible={isVisible} onClose={nav.back}/>;
   case 'search':return <SearchResultsPage scope={page.scope} query={page.query} filters={page.filters} onBack={nav.back}/>;
   case 'business':return <BusinessPreview onClose={nav.back}/>;
   default:return <PersonalPage page={page.page} onBack={nav.back} onPlace={place} onAccount={openAccount}/>;
  }
 }
 return <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-rose-900 selection:text-white">
 <div className="demo-ribbon"><span className="demo-dot"/>Mode démonstration · données fictives</div>
 <Header onHiddenChange={setFeedHeaderHidden} onOpenMenu={()=>setMenu(true)} onProfile={()=>profile(currentUser.id)} feedFilter={feedFilter} onFeedFilter={setFeedFilter}/>
 <InAppNotificationToast/>
 {restoreNotice&&<p role="status" className="p-3 text-xs text-blue-400 bg-soft">{restoreNotice}</p>}
 {syncError&&<div role="alert" className="max-w-2xl mx-auto w-full p-3 text-xs text-rose-400 bg-soft border border-line rounded-xl">{syncError}<button type="button" onClick={()=>void refreshSharedData()} className="ml-2 underline">Réessayer la synchronisation</button></div>}
 <Welcome bannerTarget={welcomeTarget} visible={route.page==='main'&&activeTab==='feed'&&!operatorVisible}/>
 <main key={currentUser.id+':'+isServerAuthenticated} className={`flex-1 w-full ${route.page==='main'&&activeTab==='map'?'':'max-w-4xl mx-auto'}`}>
 {authSessionToken&&(!isServerAuthenticated||!sharedStateReady)?<div className="p-6 space-y-3"><p role="status">Vérification de votre connexion…</p><button type="button" onClick={openAccount} className="p-3 rounded-xl bg-soft text-sm">Gérer mon compte</button></div>:operatorVisible?<OperatorConsole/>:<>
 {tabs.map(tab=><div key={tab} hidden={route.page!=='main'||activeTab!==tab} tabIndex={-1} data-route-key={route.page==='main'&&activeTab===tab?nav.current.key:undefined} className="outline-none">
 {tab==='feed'?<FeedView onWelcomeTarget={setWelcomeTarget} onFeedFilter={setFeedFilter} headerHidden={feedHeaderHidden} feedFilter={feedFilter} onSelectPlace={place}/>:tab==='map'?<MapView onSelectPlace={place}/>:tab==='messages'?<MessagesPage isVisible={route.page==='main'&&activeTab==='messages'}/>:tab==='sortir'?<SortirView onSelectPlace={place}/>:<ProfileView onOpenBadges={()=>nav.push({page:'progress',tab:'profile'})} onSelectPlace={place} onOpenAuth={openAccount} onOpenSettings={openSettings}/>}
 </div>)}
 {nav.entries.filter(entry=>entry.route.page!=='main').map(entry=><div key={entry.key} hidden={entry.key!==nav.current.key} tabIndex={-1} data-route-key={entry.key} className="outline-none">{secondary(entry.route,entry.key===nav.current.key)}</div>)}
 </>}
 </main>
 {!operatorVisible&&route.page!=='conversation'&&!composer&&<BottomNav unread={exp.unread} activeTab={activeTab} onSelectTab={tab=>{dismissToastNotification();nav.goTab(tab);}} onOpenCheckin={()=>setActions(true)}/>}
 {menu&&<SideMenu onClose={()=>setMenu(false)} onAccount={openAccount} onSettings={openSettings}/>}
 {checkin&&<CheckinModal preselectedPlaceId={checkPlace} isOpen onClose={()=>setCheckin(false)} onPostPublishedSuccess={()=>{dismissToastNotification();nav.goTab('feed');}}/>}
 {actions&&<Sheet title="Que souhaitez-vous faire ?" onClose={()=>setActions(false)}><button type="button" onClick={()=>openCheck()} className="block w-full p-4 rounded-2xl bg-blue-600 text-white font-bold text-left">Faire un check</button><button type="button" onClick={()=>openComposer()} className="block w-full p-4 rounded-2xl bg-soft font-bold text-left">Créer une publication</button></Sheet>}
 {composer&&<Composer key={authSessionToken} context={composer} onClose={()=>setComposer(null)} onPublished={()=>{setComposer(null);dismissToastNotification();nav.goTab('feed');}}/>}
 {share&&<ShareSheet entity={share} onClose={()=>setShare(null)}/>}
 <AuthModal isOpen={auth} onClose={()=>setAuth(false)}/><NotificationCenterModal isOpen={notifications} onClose={()=>setNotifications(false)}/><SettingsModal isOpen={settings} onClose={()=>setSettings(false)} onOpenBusiness={()=>{setIsOperatorView(false);nav.push({page:'business',tab:activeTab});}}/>
 </div>;
}
export default function App(){return <StoreProvider><NavigationProvider><StoriesProvider><ExperienceProvider><AppContent/></ExperienceProvider></StoriesProvider></NavigationProvider></StoreProvider>;}
