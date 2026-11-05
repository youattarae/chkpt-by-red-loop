import type {EntityRef} from '../../../shared/entities';
import type {CheckInAudience,PostMedia} from '../../types';
export type ComposerContext={entity?:EntityRef;linkedPlaceId?:string;linkedCheckinId?:string;audience?:CheckInAudience;text?:string;media?:PostMedia[]};
export const openComposer=(context:ComposerContext={})=>window.dispatchEvent(new CustomEvent('chkpt:compose',{detail:context}));
export const openCheck=(placeId?:string)=>window.dispatchEvent(new CustomEvent('chkpt:check',{detail:placeId}));
export const openShare=(entity:EntityRef)=>window.dispatchEvent(new CustomEvent('chkpt:share',{detail:entity}));
