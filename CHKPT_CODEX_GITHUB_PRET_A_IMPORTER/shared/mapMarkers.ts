export const MARKER_KINDS=[{id:'restaurants',glyph:'🍴',label:'Restaurants'},{id:'maquis',glyph:'🔥',label:'Maquis'},{id:'bars_lounges',glyph:'🍸',label:'Bars / lounges'},{id:'cafes_boulangeries',glyph:'☕',label:'Cafés / boulangeries'},{id:'hotel',glyph:'🛏',label:'Hôtels'},{id:'event',glyph:'🎟',label:'Événements'},{id:'culture_art',glyph:'🏛',label:'Culture / tourisme'}] as const;
export function markerPresentation(place:{category:string;markerKind?:string;verificationStatus:string;isSponsored?:boolean}){
 const kind=MARKER_KINDS.find(k=>k.id===(place.markerKind||place.category))||{id:'autre',glyph:'📍',label:'Autre lieu'};
 return {...kind,verified:place.verificationStatus==='verified',sponsored:place.isSponsored===true};
}
export function radarPolygon(lat:number,lng:number,radius=250){
 const angle=radius/6371000,p=lat*Math.PI/180,l=lng*Math.PI/180;
 return Array.from({length:65},(_,i)=>{const b=2*Math.PI*i/64;const p2=Math.asin(Math.sin(p)*Math.cos(angle)+Math.cos(p)*Math.sin(angle)*Math.cos(b));const l2=l+Math.atan2(Math.sin(b)*Math.sin(angle)*Math.cos(p),Math.cos(angle)-Math.sin(p)*Math.sin(p2));return [l2*180/Math.PI,p2*180/Math.PI];});
}
