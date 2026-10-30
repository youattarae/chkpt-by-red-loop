import crypto from 'node:crypto';
import type {Express} from 'express';
import {db,StoryEntity,UserEntity} from './db';
import {requireAuth} from './auth';
export function pruneStories(){
  const data=db.getRawData();const stories=data.stories.filter(story=>Date.parse(story.expiresAt)>Date.now());
  const ids=new Set(stories.map(story=>story.id));const media=data.media.filter(asset=>!asset.storyId||ids.has(asset.storyId));
  if(stories.length!==data.stories.length||media.length!==data.media.length)db.updateSharedData({stories,media});
}
function canRead(story:StoryEntity,user:UserEntity){
  if(Date.parse(story.expiresAt)<=Date.now())return false;
  if(story.authorId===user.id)return true;
  const author=db.findUserById(story.authorId);
  if(!author||author.age<18||author.visibility==='private')return false;
  return story.audience==='public'||story.audience==='followers'&&db.isFollower(user.id,author.id);
}
function dto(story:StoryEntity){const author=db.findUserById(story.authorId)!;return {...story,authorName:author.displayName,authorAvatar:author.avatarUrl};}
export function installStoryRoutes(app:Express){
  const timer=setInterval(()=>{try{pruneStories();}catch{console.error('Nettoyage des stories différé.');}},60000);timer.unref();
  app.get('/api/stories',requireAuth,(req,res)=>{pruneStories();res.json({stories:db.getRawData().stories.filter(story=>canRead(story,req.user!)).map(dto)});});
  app.post('/api/stories',requireAuth,(req,res)=>{
    pruneStories();const user=req.user!;const {mediaUrl,text='',clientRequestId}=req.body;
    if(typeof text!=='string'||text.length>1000||typeof mediaUrl!=='string'||typeof clientRequestId!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(clientRequestId)){res.status(400).json({error:'invalid_story',message:'Ajoutez un média et un texte de 1 000 caractères maximum.'});return;}
    const id='story_'+crypto.createHash('sha256').update(user.id+':'+clientRequestId).digest('hex').slice(0,32);
    const existing=db.getRawData().stories.find(story=>story.id===id);if(existing){res.json({story:dto(existing)});return;}
    const audience=user.visibility==='private'||user.age<18?'private':req.body.audience||'public';
    if(!['private','public','followers'].includes(audience)){res.status(400).json({error:'invalid_audience'});return;}
    const data=db.getRawData();const asset=data.media.find(asset=>'/api/media/'+asset.assetId===mediaUrl&&asset.ownerId===user.id);
    // A story gets its own upload so expiry can never remove a publication's media.
    if(!asset||asset.storyId||data.posts.some(post=>post.mediaUrl===mediaUrl||post.media?.some(item=>item.url===mediaUrl))){res.status(403).json({error:'story_upload_required',message:'Importez un nouveau média pour cette story.'});return;}
    if(data.stories.filter(story=>story.authorId===user.id).length>=20){res.status(429).json({error:'story_limit',message:'20 stories actives maximum dans le prototype.'});return;}
    const timestamp=Date.now();
    const story:StoryEntity={id,authorId:user.id,mediaUrl,mediaType:asset.mimeType.startsWith('video/')?'video':'image',text:text.trim(),audience,createdAt:new Date(timestamp).toISOString(),expiresAt:new Date(timestamp+86400000).toISOString()};
    db.updateSharedData({stories:[...data.stories,story],media:data.media.map(item=>item.assetId===asset.assetId?{...item,audience,storyId:id}:item)});
    res.status(201).json({story:dto(story)});
  });
  app.delete('/api/stories/:id',requireAuth,(req,res)=>{
    const data=db.getRawData();const story=data.stories.find(story=>story.id===req.params.id);
    if(!story||story.authorId!==req.user!.id){res.status(404).json({error:'story_unavailable'});return;}
    db.updateSharedData({stories:data.stories.filter(item=>item.id!==story.id),media:data.media.filter(item=>item.storyId!==story.id)});res.json({success:true});
  });
}
