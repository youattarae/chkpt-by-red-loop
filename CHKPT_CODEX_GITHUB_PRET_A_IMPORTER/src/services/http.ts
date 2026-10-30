/** Bound writes so a stalled connection offers a retry instead of an endless spinner. */
export async function fetchWithTimeout(url:string,init:RequestInit={},milliseconds=12000){
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),milliseconds);
 try{return await fetch(url,{...init,signal:controller.signal});}finally{clearTimeout(timer);}
}
