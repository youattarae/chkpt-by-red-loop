import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordinates, Place } from '../../types';
const districts = [
  {name:'Cocody',lat:5.35,lng:-3.99}, {name:'Marcory',lat:5.30,lng:-3.99},
  {name:'Plateau',lat:5.325,lng:-4.025}, {name:'Yopougon',lat:5.345,lng:-4.08}, {name:'Riviera',lat:5.365,lng:-3.96},
];
export function DynamicMap({ places, position, ready, simulated, selectedId, onSelect, onFallback }: {places:Place[];position:Coordinates;ready:boolean;simulated:boolean;selectedId:string|null;onSelect:(id:string)=>void;onFallback:()=>void}) {
  const node=useRef<HTMLDivElement>(null);
  const map=useRef<L.Map|null>(null);
  const layer=useRef<L.LayerGroup|null>(null);
  const [tileError,setTileError]=useState(false);
  useEffect(()=>{
    if(!node.current) return;
    const instance=L.map(node.current,{center:[5.348,-4.015],zoom:12,zoomControl:true,scrollWheelZoom:true});
    map.current=instance; layer.current=L.layerGroup().addTo(instance);
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'}).addTo(instance);
    tiles.on('tileerror',()=>{setTileError(true);onFallback();});
    const observer=new ResizeObserver(()=>instance.invalidateSize());observer.observe(node.current);
    return()=>{observer.disconnect();instance.remove();map.current=null;};
  },[]);
  useEffect(()=>{
    if(!map.current||!layer.current) return;
    layer.current.clearLayers();
    if(ready){
      L.circle([position.lat,position.lng],{radius:250,color:'#1263dc',fillColor:'#52bfff',fillOpacity:.15,weight:2}).bindTooltip('Radar de présence · 250 m').addTo(layer.current);
      L.circleMarker([position.lat,position.lng],{radius:7,color:'#fff',fillColor:'#1263dc',fillOpacity:1,weight:3}).bindTooltip(simulated?'Position simulée':'Position GPS').addTo(layer.current);
    }
    for(const place of places){
      const marker=L.marker([place.coordinates.lat,place.coordinates.lng],{icon:L.divIcon({className:'chkpt-map-marker',html:`<span aria-hidden="true" style="display:block;width:22px;height:22px;border-radius:50%;background:${selectedId===place.id?'#bc0045':'#1263dc'};border:3px solid white;box-shadow:0 2px 8px #0006"></span>`,iconSize:[28,28],iconAnchor:[14,14]}),title:place.name,alt:place.name});
      // Leaflet treats plain tooltip strings as HTML; use a text node for venue names.
      const label=document.createElement('span');label.textContent=place.name;
      marker.bindTooltip(label).on('click',()=>onSelect(place.id)).addTo(layer.current);
      marker.getElement()?.setAttribute('aria-label',`Choisir ${place.name}`);
    }
  },[places,position.lat,position.lng,ready,simulated,selectedId,onSelect]);
  return <section aria-label="Carte interactive d’Abidjan" className="relative flex-1 min-h-[420px] flex flex-col">
    <div className="flex flex-wrap gap-1 px-3 py-2 bg-canvas relative z-[1]">{districts.map(district=><button type="button" key={district.name} onClick={()=>map.current?.flyTo([district.lat,district.lng],13,{duration:.4})} className="rounded-lg bg-soft px-2 py-1.5 text-[10px] text-body cursor-pointer">Centrer {district.name}</button>)}<button type="button" disabled={!ready} onClick={()=>map.current?.flyTo([position.lat,position.lng],16,{duration:.4})} className="rounded-lg bg-blue-950 px-2 py-1.5 text-[10px] text-blue-400 disabled:opacity-50 cursor-pointer">Mon radar · 250 m</button></div>
    <div ref={node} aria-label="Fond OpenStreetMap, zoom et déplacement" className="flex-1 min-h-[340px] z-0" />
    <p className="absolute bottom-28 left-3 right-3 z-[1] rounded-xl bg-canvas/95 text-[10px] text-body p-2 border border-line pointer-events-none">{ready?`${simulated?'Position simulée':'Position GPS'} · cercle de 250 m, éligibilité finale vérifiée par le serveur.`:'GPS en attente : radar masqué.'}</p>
    {tileError&&<div role="status" className="absolute top-24 left-3 right-3 z-[2] rounded-xl bg-canvas border border-line p-3 text-xs text-body">Fond de carte indisponible. Les repères restent consultables.<button type="button" onClick={onFallback} className="block text-blue-400 font-bold mt-2 cursor-pointer">Utiliser la carte illustrée hors connexion</button></div>}
  </section>;
}
