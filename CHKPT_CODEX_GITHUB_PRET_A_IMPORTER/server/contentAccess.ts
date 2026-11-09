import {db,UserEntity,StoredPost,StoryEntity} from './db';
import {privateDemoEnabled} from './demoConfig';
export const blocked=(a:UserEntity,b:UserEntity)=>!!a.blockedUserIds?.includes(b.id)||!!b.blockedUserIds?.includes(a.id);
// Only the seeded supervisor in a private demo may converse while keeping its profile private.
export const dmEligible=(u:UserEntity)=>u.age>=18&&(u.visibility==='public'&&['user','creator','pro'].includes(u.role)||privateDemoEnabled&&u.id==='usr_admin'&&['admin','superadmin'].includes(u.role));
export const canMessage=(a:UserEntity,b:UserEntity)=>a.id!==b.id&&dmEligible(a)&&dmEligible(b)&&!blocked(a,b);
export function canReadPost(post:StoredPost,user?:UserEntity){
 if(user?.id===post.authorId)return true;
 const owner=db.findUserById(post.authorId);
 if(!owner||owner.age<18||owner.visibility==='private'||user&&blocked(user,owner))return false;
 return post.audience==='public'||post.audience==='followers'&&!!user&&db.isFollower(user.id,owner.id);
}
export function canReadStory(story:StoryEntity,user?:UserEntity){
 if(!user||story.isDemo&&!privateDemoEnabled||Date.parse(story.expiresAt)<=Date.now())return false;
 if(story.authorId===user.id)return true;
 const owner=db.findUserById(story.authorId);
 return !!owner&&owner.age>=18&&owner.visibility==='public'&&!blocked(user,owner)&&(story.audience==='public'||story.audience==='followers'&&db.isFollower(user.id,owner.id));
}
