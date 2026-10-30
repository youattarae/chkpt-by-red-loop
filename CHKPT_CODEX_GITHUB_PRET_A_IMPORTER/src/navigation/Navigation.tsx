import {createContext,useContext,useEffect,useLayoutEffect,useRef,useState,ReactNode} from 'react';
import type {MainTab} from '../components/common/BottomNav';
import {useStore} from '../services/store';
export type SearchScope='all'|'places'|'sortir';
export interface SearchFilters {type:string;sort:string;category:string;radius:string;categories?:string[]}
export const defaultFilters:SearchFilters={type:'all',sort:'relevance',category:'all',radius:'all'};
export type Route={page:'main';tab:MainTab}|{page:'place'|'event'|'profile'|'followers'|'following';id:string;tab:MainTab}|{page:'search';scope:SearchScope;query:string;filters:SearchFilters;tab:MainTab}|{page:'saved'|'history'|'progress'|'rewards'|'ranking'|'help'|'business';tab:MainTab};
export interface Entry {key:string;route:Route;depth:number}
const tabs=['feed','map','sortir','profile'];const personal=['saved','history','progress','rewards','ranking','help','business'];const entities=['place','event','profile','followers','following'];
const key=()=>Array.from(crypto.getRandomValues(new Uint8Array(8)),byte=>byte.toString(16).padStart(2,'0')).join('');
const safeId=(value:string|null)=>value&&/^[a-zA-Z0-9_-]{1,100}$/.test(value)?value:null;
export function readRoute(hash=window.location.hash):Route{
 const params=new URLSearchParams(hash.replace(/^#/,''));const tab=(tabs.includes(params.get('tab')||'')?params.get('tab'):'feed') as MainTab;
 const place=safeId(params.get('lieu'));if(place)return {page:'place',id:place,tab};
 const page=params.get('page')||'main';if(entities.includes(page)){const id=safeId(params.get('id'));if(id)return {page:page as 'profile',id,tab};}
 if(personal.includes(page))return {page:page as 'saved',tab};
 if(page==='search'){
  const type=params.get('type')||'all',sort=params.get('sort')||'relevance',scope=params.get('scope')||'all';
  return {page:'search',tab,scope:['all','places','sortir'].includes(scope)?scope as SearchScope:'all',query:(params.get('q')||'').slice(0,150),filters:{type:['all','profiles','places','events','posts'].includes(type)?type:'all',sort:['relevance','name'].includes(sort)?sort:'relevance',category:params.get('cat')||'all',radius:['all','1000','5000','10000','20000'].includes(params.get('radius')||'')?params.get('radius')!:'all',categories:(params.get('cats')||'').split(',').filter(value=>['maquis','restaurants','bars_lounges','cafes_boulangeries','culture_art'].includes(value))}};
 }
 return {page:'main',tab};
}
function address(route:Route){
 const params=new URLSearchParams();if(route.page==='place')params.set('lieu',route.id);else params.set('page',route.page);
 params.set('tab',route.tab);if('id'in route&&route.page!=='place')params.set('id',route.id);
 if(route.page==='search'){params.set('scope',route.scope);params.set('q',route.query);params.set('type',route.filters.type);params.set('sort',route.filters.sort);params.set('cat',route.filters.category);params.set('radius',route.filters.radius);if(route.filters.categories?.length)params.set('cats',route.filters.categories.join(','));}
 return window.location.pathname+window.location.search+'#'+params.toString();
}
interface Navigation {current:Entry;entries:Entry[];push:(route:Route)=>void;replace:(route:Route)=>void;back:()=>void;goTab:(tab:MainTab)=>void}
const Context=createContext<Navigation|null>(null);
export function NavigationProvider({children}:{children:ReactNode}){
 const {authSessionToken:token,currentUser,isServerAuthenticated}=useStore();
 const [initial]=useState<Entry>(()=>({key:window.history.state?.chkptKey||key(),route:readRoute(),depth:Math.max(0,Math.min(100,Number(window.history.state?.chkptDepth)||0))}));
 const [current,setCurrent]=useState(initial),[entries,setEntries]=useState<Entry[]>([initial]);const ref=useRef(current);ref.current=current;
 const positions=useRef(new Map<string,number>([[initial.key,Number(window.history.state?.chkptScroll)||0]]));const focus=useRef(new Map<string,HTMLElement>());
 const actor=useRef('');if(isServerAuthenticated)actor.current=currentUser.id;
 function save(){positions.current.set(ref.current.key,window.scrollY);if(document.activeElement instanceof HTMLElement)focus.current.set(ref.current.key,document.activeElement);window.history.replaceState({...window.history.state,chkptScroll:window.scrollY},'');}
 function record(entry:Entry,replace=false){
  const state={chkptKey:entry.key,chkptDepth:entry.depth,chkptActor:actor.current,chkptScroll:replace?positions.current.get(entry.key)||0:0};
  window.history[replace?'replaceState':'pushState'](state,'',address(entry.route));
  setEntries(previous=>{const found=previous.findIndex(item=>item.key===entry.key);return found>=0?previous.map(item=>item.key===entry.key?entry:item):[...previous.slice(-39),entry];});setCurrent(entry);
 }
 function push(route:Route){save();record({key:key(),route,depth:Math.min(100,ref.current.depth+1)});}
 function replace(route:Route){save();record({...ref.current,route},true);}
 function back(){if(ref.current.depth>0){save();window.history.back();}else replace({page:'main',tab:ref.current.route.tab});}
 function goTab(tab:MainTab){if(ref.current.route.page==='main'&&ref.current.route.tab===tab)return;push({page:'main',tab});}
 useEffect(()=>{
  const previous=history.scrollRestoration;history.scrollRestoration='manual';
  history.replaceState({...history.state,chkptKey:initial.key,chkptDepth:initial.depth},'');
  const pop=()=>{
   positions.current.set(ref.current.key,window.scrollY);
   const state=history.state||{};let route=readRoute();
   if(state.chkptActor&&state.chkptActor!==actor.current&& !['place','event','profile','main'].includes(route.page)){route={page:'main',tab:'feed'};history.replaceState({...state,chkptActor:actor.current},'',address(route));}
   const entry={key:state.chkptKey||key(),route,depth:Math.max(0,Math.min(100,Number(state.chkptDepth)||0))};
   ref.current=entry;
   if(!positions.current.has(entry.key))positions.current.set(entry.key,Number(state.chkptScroll)||0);
   setEntries(previous=>previous.some(item=>item.key===entry.key)?previous.map(item=>item.key===entry.key?entry:item):[...previous.slice(-39),entry]);setCurrent(entry);
  };
  const hash=()=>{if(JSON.stringify(readRoute())===JSON.stringify(ref.current.route))return;const entryKey=key();history.replaceState({...history.state,chkptKey:entryKey,chkptDepth:ref.current.depth+1,chkptScroll:0},'');pop();};
  window.addEventListener('popstate',pop);window.addEventListener('hashchange',hash);
  return()=>{history.scrollRestoration=previous;window.removeEventListener('popstate',pop);window.removeEventListener('hashchange',hash);};
 },[]);
 const previousToken=useRef(token);
 useEffect(()=>{if(previousToken.current===token)return;previousToken.current=token;actor.current='';const route=ref.current.route;const safe=['place','event','profile'].includes(route.page)?route:{page:'main' as const,tab:route.tab};const entry={key:key(),route:safe,depth:0};positions.current.clear();focus.current.clear();history.replaceState({chkptKey:entry.key,chkptDepth:0},'',address(safe));setEntries([entry]);setCurrent(entry);},[token]);
 useLayoutEffect(()=>{
  let cancelled=false;const top=positions.current.get(current.key)||0;
  const frame=requestAnimationFrame(()=>{window.scrollTo(0,top);const old=focus.current.get(current.key);if(old?.isConnected&&old.getClientRects().length)old.focus({preventScroll:true});else document.querySelector<HTMLElement>(`[data-route-key="${current.key}"]`)?.focus({preventScroll:true});});
  const cancel=()=>{cancelled=true;};window.addEventListener('pointerdown',cancel,{once:true});window.addEventListener('wheel',cancel,{once:true});
  const retry=setTimeout(()=>{if(!cancelled)window.scrollTo(0,top);},120);
  return()=>{cancelAnimationFrame(frame);clearTimeout(retry);window.removeEventListener('pointerdown',cancel);window.removeEventListener('wheel',cancel);};
 },[current.key]);
 return <Context.Provider value={{current,entries,push,replace,back,goTab}}>{children}</Context.Provider>;
}
export function useNavigation(){const value=useContext(Context);if(!value)throw Error('Navigation provider missing');return value;}
