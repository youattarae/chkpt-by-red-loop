import type {Express} from 'express';
import {db,UserEntity} from './db';
import {requireAuth} from './auth';
const publicProfile=(user:UserEntity)=>user.age>=18&&user.visibility==='public';
const summary=(user:UserEntity)=>({id:user.id,displayName:user.displayName,username:user.username,avatarUrl:user.avatarUrl,visibility:publicProfile(user)?'public':'private'});
const normalize=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function installDiscoveryRoutes(app:Express){
  app.get('/api/search/profiles',requireAuth,(req,res)=>{
    if(typeof req.query.q!=='string'||req.query.q.length>150){res.status(400).json({error:'invalid_query'});return;}
    const words=normalize(req.query.q).trim().split(/\s+/).filter(Boolean);
    const users=words.length?db.getRawData().users.filter(user=>(publicProfile(user)||user.id===req.user!.id)&&words.every(word=>normalize(user.displayName+' '+user.username).includes(word))).slice(0,30):[];
    res.json({profiles:users.map(summary)});
  });
  app.get('/api/profiles/:id/connections',requireAuth,(req,res)=>{
    const owner=db.findUserById(req.params.id as string);const kind=req.query.kind;
    if(!owner||!publicProfile(owner)&&owner.id!==req.user!.id){res.status(404).json({error:'profile_unavailable'});return;}
    if(kind!=='followers'&&kind!=='following'){res.status(400).json({error:'invalid_connections'});return;}
    const ids=new Set(db.getRawData().follows.filter(follow=>kind==='followers'?follow.followedId===owner.id:follow.followerId===owner.id).map(follow=>kind==='followers'?follow.followerId:follow.followedId));
    const profiles=db.getRawData().users.filter(user=>ids.has(user.id)&&(publicProfile(user)||user.id===req.user!.id)).map(summary);
    res.json({profiles,kind});
  });
  app.get('/api/explorers/monthly',requireAuth,(req,res)=>{
    const scope=req.query.scope||'global';if(scope!=='global'&&scope!=='friends'){res.status(400).json({error:'invalid_scope'});return;}
    const now=new Date();const start=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1);const end=Date.UTC(now.getUTCFullYear(),now.getUTCMonth()+1,1);
    const totals=new Map<string,number>();const seen=new Set<string>();
    for(const entry of db.getRawData().points_ledger){
      const time=Date.parse(entry.timestamp);
      if(!seen.has(entry.id)&&entry.sourceAction==='CHECKIN_VERIFIED'&&Number.isFinite(entry.amount)&&entry.amount>0&&time>=start&&time<end&&time<=now.getTime())totals.set(entry.userId,(totals.get(entry.userId)||0)+entry.amount);
      seen.add(entry.id);
    }
    const viewer=req.user!;
    const users=db.getRawData().users.filter(user=>user.id===viewer.id||publicProfile(user)&&['user','creator','pro'].includes(user.role))
      .filter(user=>scope==='global'||user.id===viewer.id||db.isFollower(viewer.id,user.id)&&db.isFollower(user.id,viewer.id))
      .map(user=>({...summary(user),monthlyXp:totals.get(user.id)||0,isMe:user.id===viewer.id}));
    users.sort((a,b)=>b.monthlyXp-a.monthlyXp||a.username.localeCompare(b.username,'fr'));
    res.json({month:new Date(start).toISOString().slice(0,7),monthLabel:now.toLocaleDateString('fr-FR',{month:'long',year:'numeric',timeZone:'Africa/Abidjan'}),scope,profiles:users.slice(0,100).map((user,index)=>({...user,rank:index+1}))});
  });

}
