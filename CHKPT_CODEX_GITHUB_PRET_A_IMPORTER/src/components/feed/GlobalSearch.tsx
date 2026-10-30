import {SearchBar} from '../search/SearchExperience';
export function GlobalSearch(_props:{onSelectPlace:(id:string)=>void}){return <section aria-label="Recherche générale"><SearchBar scope="all"/></section>;}
