import { Express, Request } from 'express';
import crypto from 'node:crypto';
import { db, StoredPost, UserEntity } from './db';
import { evaluateBadges, awardPublishedPhoto } from './badgeEngine';
import { requireAuth } from './auth';
import type { Post } from '../src/types';

export function canReadPost(post:StoredPost,user?:UserEntity):boolean {
  if(user?.id===post.authorId)return true;
  const owner=db.findUserById(post.authorId);
  if(!owner||owner.visibility==='private'||owner.age<18)return false;
  return post.audience==='public'||(post.audience==='followers'&&!!user&&db.isFollower(user.id,owner.id));
}
function postDTO(post:StoredPost,user?:UserEntity):Post {
  const {likedBy,baseLikesCount,baseCommentsCount,...content}=post;
  return {...content,likesCount:baseLikesCount+likedBy.length,isLikedByCurrentUser:!!user&&likedBy.includes(user.id),commentsCount:baseCommentsCount+post.comments.length};
}
export function readablePosts(user?:UserEntity):Post[]{return db.getRawData().posts.filter(post=>canReadPost(post,user)).map(post=>postDTO(post,user));}
export function installSocialRoutes(app:Express){
  app.get('/api/posts',(req,res)=>{res.setHeader('Cache-Control','private, no-store');res.json({posts:readablePosts(req.user)});});
  app.get('/api/account/state',requireAuth,(req,res)=>{
    res.setHeader('Cache-Control','private, no-store');
    const user=req.user!;
    res.json({userId:user.id,user:{id:user.id,displayName:user.displayName,username:user.username,avatarUrl:user.avatarUrl,bio:user.bio,homeZone:user.homeZone,role:user.role,visibility:user.visibility,age:user.age,xpPoints:user.xpPoints,level:user.level,checkinsCount:user.checkinsCount,followersCount:user.followersCount,followingCount:user.followingCount},badges:evaluateBadges(user.id).badges,followingIds:db.getFollowing(user.id),posts:readablePosts(user),savedPlaceIds:db.getRawData().saved_places.filter(item=>item.userId===user.id).map(item=>item.placeId),checkins:db.getCheckins(user.id),pointsLedger:db.getRawData().points_ledger.filter(entry=>entry.userId===user.id).map(entry=>({id:entry.id,userId:entry.userId,sourceAction:entry.sourceAction,deltaXp:entry.amount,referenceId:entry.referenceId,timestamp:entry.timestamp,label:entry.sourceAction==='BADGE_UNLOCKED'?'Palier de badge validé':entry.sourceAction==='CHECKIN_VERIFIED'?`Visite validée à ${db.findCheckinById(entry.referenceId)?.placeName||'un lieu'} (+${entry.amount} XP)`:'Preuve de progression'})).reverse()});
  });
  app.post('/api/posts',requireAuth,(req,res)=>{
    const user=req.user!;const data=req.body;
    if(typeof data.text!=='string'||!data.text.trim()||data.text.trim().length>3000){res.status(400).json({error:'invalid_post',message:'Le texte doit contenir de 1 à 3 000 caractères.'});return;}
    const place=data.linkedPlaceId?db.findPlaceById(data.linkedPlaceId):undefined;
    const check=data.linkedCheckinId?db.findCheckinById(data.linkedCheckinId):undefined;
    if((data.linkedPlaceId&&!place)||(data.linkedCheckinId&&(!check||check.userId!==user.id||check.status!=='verified'||check.placeId!==place?.id))){res.status(400).json({error:'invalid_visit_link'});return;}
    const audience=user.visibility==='private'||user.age<18?'private':(data.audience===undefined?'public':data.audience);
    if(!['public','followers','private'].includes(audience)){res.status(400).json({error:'invalid_audience'});return;}
    const requested=data.media===undefined?(data.mediaUrl?[{url:data.mediaUrl}]:[]):data.media;
    if(!Array.isArray(requested)||requested.length>4||requested.some(item=>!item||typeof item.url!=='string')){res.status(400).json({error:'invalid_media',message:'Quatre images ou vidéos maximum par publication.'});return;}
    if(new Set(requested.map(item=>item.url)).size!==requested.length){res.status(400).json({error:'duplicate_media'});return;}
    let media=db.getRawData().media;
    const attachments:NonNullable<Post['media']>=[];
    for(const item of requested){
      if(item.url.startsWith('/api/media/')){
        const asset=media.find(asset=>'/api/media/'+asset.assetId===item.url&&asset.ownerId===user.id);
        if(!asset||asset.storyId){res.status(403).json({error:'media_owner_required'});return;}
        const attached=db.getRawData().posts.some(post=>post.mediaUrl===item.url||post.media?.some(media=>media.url===item.url));
        if(attached&&asset.audience!==audience){res.status(409).json({error:'media_audience_mismatch',message:'Importez un nouveau média pour choisir une autre visibilité.'});return;}
        media=media.map(entry=>entry.assetId===asset.assetId?{...entry,audience}:entry);
        attachments.push({url:item.url,type:asset.mimeType.startsWith('video/')?'video':'image'});
      }else{
        const allowed=new Set(db.getPlaces().map(item=>item.coverImage).concat(['/illustrations/maquis-demo.png','/illustrations/rooftop-demo.png','/illustrations/culture-demo.png']));
        if(!allowed.has(item.url)){res.status(400).json({error:'upload_required',message:'Importez le média avant de publier.'});return;}
        attachments.push({url:item.url,type:'image'});
      }
    }
    const mediaUrl=attachments.find(item=>item.type==='image')?.url;
    const nonce=typeof data.clientRequestId==='string'&&/^[a-zA-Z0-9_-]{8,100}$/.test(data.clientRequestId)?data.clientRequestId:null;
    if(!nonce){res.status(400).json({error:'request_id_required'});return;}
    const id='post_'+crypto.createHash('sha256').update(user.id+':'+nonce).digest('hex').slice(0,32);
    const existing=db.getRawData().posts.find(item=>item.id===id);
    if(existing){const awards=existing.linkedCheckinId&&existing.mediaUrl?awardPublishedPhoto(user.id,existing.linkedCheckinId,existing.mediaUrl):null;res.json({post:postDTO(existing,user),awards});return;}
    const post:StoredPost={id,authorId:user.id,authorName:user.displayName,authorUsername:user.username,authorAvatar:user.avatarUrl,createdAt:new Date().toISOString(),text:data.text.trim(),media:attachments,mediaUrl,mediaType:'image',linkedPlaceId:place?.id,linkedPlaceName:place?.name,linkedCheckinId:check?.id,isVerifiedVisit:!!check,isSimulated:check?.isSimulated,audience,likesCount:0,isLikedByCurrentUser:false,commentsCount:0,comments:[],likedBy:[],baseLikesCount:0,baseCommentsCount:0};
    db.updateSharedData({posts:[post,...db.getRawData().posts],media});
    const awards=check&&mediaUrl?awardPublishedPhoto(user.id,check.id,mediaUrl):null;
    res.status(201).json({post:postDTO(post,user),awards});
  });
  function findPost(req:Request){return db.getRawData().posts.find(post=>post.id===req.params.id&&canReadPost(post,req.user));}
  app.post('/api/posts/:id/like',requireAuth,(req,res)=>{
    const post=findPost(req);if(!post){res.status(404).json({error:'post_unavailable'});return;}
    if(typeof req.body.liked!=='boolean'){res.status(400).json({error:'invalid_like'});return;}
    const ids=post.likedBy.filter(id=>id!==req.user!.id);if(req.body.liked)ids.push(req.user!.id);
    const updated={...post,likedBy:ids};db.updateSharedData({posts:db.getRawData().posts.map(item=>item.id===post.id?updated:item)});res.json({post:postDTO(updated,req.user)});
  });
  app.post('/api/posts/:id/comments',requireAuth,(req,res)=>{
    const post=findPost(req);if(!post){res.status(404).json({error:'post_unavailable'});return;}
    const user=req.user!;if((user.age<18||user.visibility==='private')&&post.authorId!==user.id){res.status(403).json({error:'private_profile'});return;}
    if(typeof req.body.text!=='string'||!req.body.text.trim()||req.body.text.trim().length>1000){res.status(400).json({error:'invalid_comment'});return;}
    if(typeof req.body.clientRequestId!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(req.body.clientRequestId)){res.status(400).json({error:'request_id_required'});return;}
    const id='comment_'+crypto.createHash('sha256').update(user.id+':'+post.id+':'+req.body.clientRequestId).digest('hex').slice(0,32);
    if(post.comments.some(item=>item.id===id)){res.json({post:postDTO(post,user)});return;}
    const updated={...post,comments:[...post.comments,{id,authorId:user.id,authorName:user.displayName,authorAvatar:user.avatarUrl,text:req.body.text.trim(),createdAt:new Date().toISOString()}]};
    db.updateSharedData({posts:db.getRawData().posts.map(item=>item.id===post.id?updated:item)});res.json({post:postDTO(updated,user)});
  });
  app.post('/api/account/saved-places',requireAuth,(req,res)=>{
    const {placeId,saved}=req.body;
    if(!db.findPlaceById(placeId)||typeof saved!=='boolean'){res.status(400).json({error:'invalid_saved_place'});return;}
    const items=db.getRawData().saved_places.filter(item=>!(item.userId===req.user!.id&&item.placeId===placeId));
    if(saved)items.push({userId:req.user!.id,placeId});db.updateSharedData({saved_places:items});
    res.json({savedPlaceIds:items.filter(item=>item.userId===req.user!.id).map(item=>item.placeId)});
  });
}
