import {useState,useRef,useEffect} from 'react';
import {PostMedia} from '../../types';
import {useStore} from '../../services/store';
import {SafeImage} from './SafeImage';
import {SafeVideo} from './SafeVideo';
export function PostMediaUploader({value,onChange,onBusy,maxCount=4,privateUpload=false,disabled=false}:{disabled?:boolean;maxCount?:number;privateUpload?:boolean;value:PostMedia[];onChange:(items:PostMedia[])=>void;onBusy:(busy:boolean)=>void}){
  const {authSessionToken,currentUser}=useStore();
  const alive=useRef(true);const uploaded=useRef(new Set<string>());
  const discard=(url:string)=>fetch(url,{method:'DELETE',headers:{Authorization:`Bearer ${authSessionToken}`}}).catch(()=>{});
  useEffect(()=>{alive.current=true;const owned=uploaded.current;return()=>{alive.current=false;for(const url of owned)void discard(url);owned.clear();};},[authSessionToken]);
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  async function upload(files:File[]){
    if(disabled||busy)return;
    if(files.length+value.length>maxCount){setError(`${maxCount} média${maxCount>1?'s':''} maximum.`);return;}
    setBusy(true);onBusy(true);setError('');const result=[...value];
    try{for(const file of files){
      if(!['image/jpeg','image/png','image/webp','video/mp4','video/webm'].includes(file.type))throw Error('Formats acceptés : JPG, PNG, WebP, MP4 et WebM.');
      if(file.size>15*1024*1024)throw Error('Chaque fichier doit faire au maximum 15 Mo.');
      let data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('Lecture du fichier impossible.'));reader.readAsDataURL(file);});
      let mime=file.type;
      if(mime.startsWith('image/')){
        const image=await new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Image illisible.'));img.src=data;});
        const canvas=document.createElement('canvas');const ratio=Math.min(1,1920/Math.max(image.width,image.height));canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));
        const context=canvas.getContext('2d');if(!context)throw Error('Traitement image indisponible.');context.drawImage(image,0,0,canvas.width,canvas.height);data=canvas.toDataURL('image/jpeg',0.82);mime='image/jpeg';
      }
      const response=await fetch('/api/media/upload',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${authSessionToken}`},body:JSON.stringify({dataBase64:data,mimeType:mime,audience:privateUpload||currentUser.visibility==='private'?'private':'public'})});
      const body=await response.json();if(!response.ok||!body.readUrl)throw Error(body.message||'Import non confirmé. Réessayez.');
      if(!alive.current||localStorage.getItem('chkpt_session_token')!==authSessionToken){void discard(body.readUrl);return;}uploaded.current.add(body.readUrl);
      result.push({url:body.readUrl,type:mime.startsWith('video/')?'video':'image'});onChange([...result]);
    }}catch(error){setError(error instanceof Error?error.message:'Import interrompu.');}
    finally{if(alive.current&&localStorage.getItem('chkpt_session_token')===authSessionToken){setBusy(false);onBusy(false);}}
  }
  return <div className="space-y-3"><p className="text-xs text-muted">{value.length}/{maxCount} médias · 15 Mo par fichier · Photos nettoyées des métadonnées. Vidéos conservées telles quelles.</p>
    <div className="grid grid-cols-2 gap-2">{value.map((item,index)=><div key={item.url} className="rounded-xl overflow-hidden border border-line">{item.type==='video'?<SafeVideo src={item.url}/>:<SafeImage src={item.url} alt={`Photo ${index+1}`} className="w-full aspect-video object-cover"/>}<button type="button" disabled={busy||disabled} className="p-2 text-xs" onClick={()=>{onChange(value.filter((_,i)=>i!==index));if(uploaded.current.delete(item.url))void discard(item.url);}}>Retirer le média {index+1}</button></div>)}</div>
    <label className="block text-xs">{busy?'Import en cours…':'Ajouter des images ou vidéos'}<input aria-label="Images ou vidéos de la publication" type="file" multiple disabled={disabled||busy||value.length>=maxCount} accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={event=>{const files=Array.from(event.target.files||[]);event.target.value='';void upload(files);}} className="block mt-2 w-full"/></label>
    {error&&<p role="alert" className="text-xs text-rose-500">{error}</p>}</div>;
}
