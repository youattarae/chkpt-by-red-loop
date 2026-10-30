/** Browser caches are optional; the server remains the source of truth. */
export function readStorage(key:string):string|null {try{return localStorage.getItem(key);}catch{return null;}}
export function writeStorage(key:string,value:string):boolean {try{localStorage.setItem(key,value);return true;}catch{return false;}}
export function readCache<T>(key:string,fallback:T,valid:(value:unknown)=>boolean):T {
 try{const value=JSON.parse(readStorage(key)||'null');return valid(value)?value as T:fallback;}catch{return fallback;}
}
export const objectList=(value:unknown):value is Record<string,unknown>[]=>Array.isArray(value)&&value.every(item=>item&&typeof item==='object'&&typeof item.id==='string');
