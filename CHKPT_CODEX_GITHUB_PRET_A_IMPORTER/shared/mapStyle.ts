/** Allow geographic labels only; unknown symbol layers are removed rather than leaking commercial POI names. */
export function geographicStyle<T extends {layers?:any[]}>(style:T):T{
 return {...style,layers:style.layers?.filter(layer=>{
  if(layer.type!=='symbol')return true;
  const id=String(layer.id||'').toLowerCase(),source=String(layer['source-layer']||'').toLowerCase();
  if(/poi|shop|amenity|business|commercial|airport|aerodrome|housenumber/.test(id+' '+source))return false;
  return ['place','transportation_name','water_name','waterway','boundary'].includes(source);
 })};
}
