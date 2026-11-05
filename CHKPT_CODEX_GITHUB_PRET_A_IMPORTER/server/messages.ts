import {validRef} from '../shared/entities';
import {entityCard} from './entities';
import type {Express} from 'express';
import crypto from 'node:crypto';
import {db,UserEntity} from './db';
import {requireAuth} from './auth';
const eligible=(user:UserEntity)=>user.age>=18&&user.visibility==='public'&&['user','creator','pro'].includes(user.role);
const profile=(user:UserEntity)=>({id:user.id,displayName:user.displayName,avatarUrl:user.avatarUrl});
export function installMessageRoutes(app:Express){
 app.use('/api/messages',requireAuth,(_req,res,next)=>{res.setHeader('Cache-Control','private, no-store');next();});
 app.get('/api/messages',(req,res)=>{
  const id=req.user!.id;
  const mine=db.getRawData().messages.filter(m=>m.senderId===id||m.recipientId===id);
  const peers=[...new Set(mine.map(m=>m.senderId===id?m.recipientId:m.senderId))];
  res.json({conversations:peers.flatMap(peerId=>{const peer=db.findUserById(peerId);if(!peer||!eligible(peer)||!eligible(req.user!))return [];const rows=mine.filter(m=>m.senderId===peerId||m.recipientId===peerId);return [{peer:profile(peer),last:{...rows.at(-1)!,card:rows.at(-1)?.entity?entityCard(rows.at(-1)!.entity!):undefined},unread:rows.filter(m=>m.recipientId===id&&!m.readAt).length}];}).sort((a,b)=>b.last!.createdAt.localeCompare(a.last!.createdAt))});
 });
 app.get('/api/messages/:peerId',(req,res)=>{
  const peer=db.findUserById(req.params.peerId as string),id=req.user!.id;
  if(!peer||peer.id===id||!eligible(peer)||!eligible(req.user!)){res.status(404).json({message:'Messagerie disponible entre profils majeurs publics uniquement.'});return;}
  const messages=db.getRawData().messages.filter(m=>m.senderId===id&&m.recipientId===peer.id||m.senderId===peer.id&&m.recipientId===id);
  res.json({peer:profile(peer),messages:messages.slice(-200).map(m=>({...m,card:m.entity?entityCard(m.entity):undefined}))});
 });
 app.post('/api/messages/:peerId/read',(req,res)=>{
  const id=req.user!.id,peerId=req.params.peerId;
  if(db.getRawData().messages.some(m=>m.senderId===peerId&&m.recipientId===id&&!m.readAt))db.updateSharedData({messages:db.getRawData().messages.map(m=>m.senderId===peerId&&m.recipientId===id&&!m.readAt?{...m,readAt:new Date().toISOString()}:m)});res.json({ok:true});
 });
 app.post('/api/messages/:peerId',(req,res)=>{
  const sender=req.user!,peer=db.findUserById(req.params.peerId as string),{text,clientRequestId,entity}=req.body;
  if(!peer||peer.id===sender.id||!eligible(peer)||!eligible(sender)){res.status(404).json({message:'Messagerie disponible entre profils majeurs publics uniquement.'});return;}
  if(entity!==undefined&&(!validRef(entity)||entityCard(entity).unavailable)){res.status(400).json({message:'Fiche indisponible.'});return;}
  if(typeof text!=='string'||!text.trim()||text.trim().length>2000||typeof clientRequestId!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(clientRequestId)){res.status(400).json({message:'Saisissez un message de 1 à 2 000 caractères.'});return;}
  const messages=db.getRawData().messages;
  const id=crypto.createHash('sha256').update(sender.id+':'+peer.id+':'+clientRequestId).digest('hex');
  const existing=messages.find(m=>m.id===id);if(existing){res.json({message:{...existing,card:existing.entity?entityCard(existing.entity):undefined}});return;}
  if(messages.filter(m=>m.senderId===sender.id&&Date.parse(m.createdAt)>Date.now()-60000).length>=20){res.status(429).json({message:'Trop de messages. Réessayez dans une minute.'});return;}
  if(messages.length>=10000){res.status(507).json({message:'Capacité du prototype atteinte.'});return;}
  const message={id,entity,senderId:sender.id,recipientId:peer.id,text:text.trim(),createdAt:new Date().toISOString()};
  db.updateSharedData({messages:[...messages,message]});res.status(201).json({message:{...message,card:entity?entityCard(entity):undefined}});
 });
}
