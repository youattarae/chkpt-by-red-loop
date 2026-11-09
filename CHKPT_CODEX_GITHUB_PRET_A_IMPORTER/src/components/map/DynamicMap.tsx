import { useEffect, useRef, useState, MutableRefObject } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordinates, Place } from '../../types';
export function DynamicMap({ camera,places, position, ready, simulated, selectedId, onSelect, onFallback }: {camera:MutableRefObject<{lat:number;lng:number;zoom:number}>;places:Place[];position:Coordinates;ready:boolean;simulated:boolean;selectedId:string|null;onSelect:(id:string)=>void;onFallback:()=>void}) {
  const node=useRef<HTMLDivElement>(null);
  const map=useRef<L.Map|null>(null);
  const layer=useRef<L.LayerGroup|null>(null);
  const [tileError,setTileError]=useState(false);
  useEffect(()=>{
    if(!node.current) return;
    const instance=L.map(node.current,{center:[camera.current.lat,camera.current.lng],zoom:camera.current.zoom,zoomControl:false,scrollWheelZoom:true});
    instance.on('moveend',()=>{const center=instance.getCenter();camera.current={lat:center.lat,lng:center.lng,zoom:instance.getZoom()};});L.control.zoom({position:'bottomright'}).addTo(instance);
    const recenter=()=>instance.flyTo([position.lat,position.lng],16,{duration:.4});window.addEventListener('chkpt:radar',recenter);
    map.current=instance; layer.current=L.layerGroup().addTo(instance);
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'}).addTo(instance);
    tiles.on('tileerror',()=>{setTileError(true);onFallback();});
    const observer=new ResizeObserver(()=>instance.invalidateSize());observer.observe(node.current);
    return()=>{window.removeEventListener('chkpt:radar',recenter);observer.disconnect();instance.remove();map.current=null;};
  },[]);
  useEffect(()=>{
    if(!map.current||!layer.current) return;
    layer.current.clearLayers();
    if(ready){
      L.circle([position.lat,position.lng],{radius:250,color:'#1263dc',fillColor:'#52bfff',fillOpacity:.15,weight:2}).bindTooltip('Radar de présence · 250 m').addTo(layer.current);
      L.circleMarker([position.lat,position.lng],{radius:7,color:'#fff',fillColor:'#1263dc',fillOpacity:1,weight:3}).bindTooltip(simulated?'Position simulée':'Position GPS').addTo(layer.current);
    }
    for(const place of places){
      const marker=L.marker([place.coordinates.lat,place.coordinates.lng],{icon:L.divIcon({className:'chkpt-map-marker',html:`<span aria-hidden="true" style="display:block;width:22px;height:22px;border-radius:50%;background:${place.verificationStatus==='verified'?'#16834b':'#737b89'};border:3px solid ${selectedId===place.id?'#1477ff':'white'};box-shadow:0 2px 8px #0006"></span>`,iconSize:[28,28],iconAnchor:[14,14]}),title:place.name+(place.verificationStatus==='verified'?' · validé':' · non validé'),alt:place.name});
      // Leaflet treats plain tooltip strings as HTML; use a text node for venue names.
      const label=document.createElement('span');label.textContent=place.name;
      marker.bindTooltip(label).on('click',()=>onSelect(place.id)).addTo(layer.current);
      marker.getElement()?.setAttribute('aria-label',`Choisir ${place.name}`);
    }
  },[places,position.lat,position.lng,ready,simulated,selectedId,onSelect]);
  return <section aria-label="Carte interactive d’Abidjan" className="absolute inset-0 flex flex-col">
    <div ref={node} aria-label="Fond OpenStreetMap, zoom et déplacement" className="absolute inset-0 z-0" />

    {tileError&&<div role="status" className="absolute top-24 left-3 right-3 z-[2] rounded-xl bg-canvas border border-line p-3 text-xs text-body">Fond de carte indisponible. Les repères restent consultables.<button type="button" onClick={onFallback} className="block text-blue-400 font-bold mt-2 cursor-pointer">Utiliser la carte illustrée hors connexion</button></div>}
  </section>;
}
