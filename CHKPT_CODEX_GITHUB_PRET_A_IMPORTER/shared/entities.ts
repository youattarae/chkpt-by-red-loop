export type EntityRef={type:'place'|'event';id:string};
export type EntityCard=EntityRef & {name:string;image:string;subtitle:string;unavailable?:boolean};
export type SavedContent={userId:string;type:'post'|'event';id:string};
export type Activity={id:string;recipientId:string;title:string;body:string;targetType:'post'|'place'|'event'|'user'|'badge';targetId?:string;createdAt:string;readAt?:string;isDemo?:boolean};
export const validRef=(value:unknown):value is EntityRef=>!!value&&typeof value==='object'&&['place','event'].includes((value as EntityRef).type)&&typeof (value as EntityRef).id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test((value as EntityRef).id);
