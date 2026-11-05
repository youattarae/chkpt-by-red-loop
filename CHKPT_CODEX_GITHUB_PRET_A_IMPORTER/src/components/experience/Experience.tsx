import {createContext,useContext,useEffect,useRef,useState,ReactNode} from 'react';
import {useStore} from '../../services/store';
import {fetchWithTimeout} from '../../services/http';
import type {Activity,SavedContent} from '../../../shared/entities';
export type Peer={id:string;displayName:string;avatarUrl:string};
export type Conversation={peer:Peer;last:{text:string;createdAt:string};unread:number};
interface Value {activity:Activity[];saved:SavedContent[];conversations:Conversation[];unread:number;error:string;refresh:()=>Promise<void>;save:(type:'post'|'event',id:string,saved:boolean)=>Promise<void>;read:(id:string)=>Promise<void>;request:(url:string,body?:unknown)=>Promise<any>}
const Context=createContext<Value|null>(null);
export function ExperienceProvider({children}:{children:ReactNode}){
 const {authSessionToken:token,isServerAuthenticated}=useStore();const [state,setState]=useState<{token:string;activity:Activity[];saved:SavedContent[];conversations:Conversation[]}>({token:'',activity:[],saved:[],conversations:[]}),[error,setError]=useState('');const current=useRef(token);current.current=token;const revision=useRef(0);
 async function request(url:string,body?:unknown){const response=await fetchWithTimeout(url,{method:body===undefined?'GET':'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});const data=await response.json();if(!response.ok)throw Error(data.message||'Action indisponible. Réessayez.');if(current.current!==token)throw Error('La session a changé.');return data;}
 async function refresh(){if(!token||!isServerAuthenticated)return;const seq=++revision.current;try{const [data,messages]=await Promise.all([request('/api/experience'),request('/api/messages')]);if(seq===revision.current&&current.current===token){setState({token,activity:data.activity,saved:data.saved,conversations:messages.conversations});setError('');}}catch(e){if(current.current===token)setError(e instanceof Error?e.message:'Connexion interrompue.');}}
 useEffect(()=>{setError('');void refresh();const visible=()=>{if(!document.hidden)void refresh();};const timer=setInterval(visible,5000);document.addEventListener('visibilitychange',visible);window.addEventListener('chkpt:experience',visible);return()=>{revision.current++;clearInterval(timer);document.removeEventListener('visibilitychange',visible);window.removeEventListener('chkpt:experience',visible);};},[token,isServerAuthenticated]);
 const data=state.token===token&&isServerAuthenticated?state:{activity:[],saved:[],conversations:[]};
 return <Context.Provider value={{...data,error,unread:data.conversations.reduce((n,c)=>n+c.unread,0),refresh,request,save:async(type,id,saved)=>{try{await request('/api/account/saved-content',{type,id,saved});await refresh();}catch(e){setError(e instanceof Error?e.message:'Enregistrement impossible.');throw e;}},read:async(id)=>{await request('/api/activity/'+encodeURIComponent(id)+'/read',{});await refresh();}}}>{children}</Context.Provider>;
}
export function useExperience(){const value=useContext(Context);if(!value)throw Error('Experience provider missing');return value;}
