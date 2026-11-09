/** Only server-created, identified presentation examples can remain available indefinitely. */
export function isPresentationStory(story:{id:string;authorId:string;isDemo?:boolean}){
 return story.isDemo===true&&['usr_sarah','usr_02','usr_nadia'].includes(story.authorId)&&story.id==='demo_story_'+story.authorId;
}
export function storyIsActive(story:{id:string;authorId:string;isDemo?:boolean;expiresAt:string},privateDemo:boolean,now=Date.now()){
 if(story.isDemo&&!privateDemo)return false;
 return privateDemo&&isPresentationStory(story)||Number.isFinite(Date.parse(story.expiresAt))&&Date.parse(story.expiresAt)>now;
}
