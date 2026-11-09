export interface PlaceSource {
 key:string;placeId:string;provider:'OSM'|'fixture';objectType:'node'|'way'|'relation';objectId:string;version?:number;sourceTimestamp?:string;importedAt:string;license:string;attribution:string;sourceUrl:string;lastValues:{name:string;category:string;coordinates:{lat:number;lng:number};address:string};
}
export interface PlaceProposal {id:string;userId:string;name:string;category:string;coordinates:{lat:number;lng:number};createdAt:string;status:'pending'|'approved'|'rejected';candidates:string[];placeId?:string;address?:string;reason?:string}
