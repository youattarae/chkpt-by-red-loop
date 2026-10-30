export const normalizeSearch=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const matchesSearch=(value:string,query:string)=>normalizeSearch(query).trim().split(/\s+/).filter(Boolean).every(word=>normalizeSearch(value).includes(word));
