import { useEffect, useState } from 'react';
import { useStore } from '../../services/store';
export function SafeVideo({src}:{src:string}){
  const {authSessionToken}=useStore();
  const [media,setMedia]=useState<{src:string;token:string;url:string}|null>(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const controller=new AbortController();let url:string|undefined;setFailed(false);
    fetch(src,{headers:authSessionToken?{Authorization:`Bearer ${authSessionToken}`}:{},cache:'no-store',signal:controller.signal})
      .then(async response=>{if(!response.ok)throw Error();return response.blob();})
      .then(blob=>{if(!controller.signal.aborted){url=URL.createObjectURL(blob);setMedia({src,token:authSessionToken,url});}})
      .catch(()=>{if(!controller.signal.aborted)setFailed(true);});
    return()=>{controller.abort();if(url)URL.revokeObjectURL(url);};
  },[src,authSessionToken]);
  if(failed)return <p role="status" className="p-3 text-sm">Vidéo indisponible.</p>;
  return media?.src===src&&media.token===authSessionToken?<video src={media.url} controls playsInline preload="metadata" className="w-full aspect-[3/2] object-contain bg-black" aria-label="Vidéo de la publication"/>:<p className="p-3 text-sm">Chargement de la vidéo…</p>;
}
