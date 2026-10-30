import React, { useEffect, useState } from 'react';
import { useStore } from '../../services/store';
/** Private images are fetched with the session header, never with a token in their URL. */
export function SafeImage({ onError, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { authSessionToken } = useStore();
  const protectedMedia=typeof src==='string'&&(src.startsWith('/api/media/')||src.startsWith('/api/ads/'));
  const [resolved,setResolved]=useState<{src:string;token:string;url:string}|null>(null);
  useEffect(()=>{
    if(!protectedMedia||typeof src!=='string')return;
    const controller=new AbortController();let blobUrl:string|undefined;
    fetch(src,{headers:authSessionToken?{Authorization:`Bearer ${authSessionToken}`}:{},signal:controller.signal,cache:'no-store'})
      .then(async response=>{if(!response.ok)throw new Error();return response.blob();})
      .then(blob=>{if(controller.signal.aborted)return;blobUrl=URL.createObjectURL(blob);setResolved({src,token:authSessionToken,url:blobUrl});})
      .catch(()=>{if(!controller.signal.aborted)setResolved({src,token:authSessionToken,url:'/illustrations/maquis.svg'});});
    return()=>{controller.abort();if(blobUrl)URL.revokeObjectURL(blobUrl);};
  },[src,protectedMedia,authSessionToken]);
  const imageSource=protectedMedia?(resolved?.src===src&&resolved.token===authSessionToken?resolved.url:'/illustrations/maquis.svg'):src;
  return <img decoding="async" {...props} src={imageSource} onError={event=>{
    onError?.(event);const image=event.currentTarget;
    if(!image.dataset.fallback){image.dataset.fallback='true';image.src='/illustrations/maquis.svg';}
  }}/>;
}
