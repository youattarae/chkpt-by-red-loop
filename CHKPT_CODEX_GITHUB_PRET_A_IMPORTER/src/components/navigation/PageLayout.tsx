import {ReactNode} from 'react';
import {ArrowLeft} from 'lucide-react';
export function PageLayout({title,onBack,children}:{title:string;onBack:()=>void;children:ReactNode}){
 return <section role="region" aria-label={title} className="max-w-2xl mx-auto pb-28"><header className="sticky top-[65px] z-20 flex items-center gap-3 border-b border-line bg-canvas/95 backdrop-blur px-4 py-3"><button type="button" onClick={onBack} aria-label="Retour" className="p-3 rounded-full hover:bg-soft"><ArrowLeft className="w-5 h-5"/></button><h1 className="text-lg font-extrabold break-words">{title}</h1></header><div className="p-4 space-y-4">{children}</div></section>;
}
