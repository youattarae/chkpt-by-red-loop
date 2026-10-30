import {useEffect,useRef,ReactNode} from 'react';
import {X} from 'lucide-react';
export function SimpleDialog({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;ref.current?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;previous?.focus();};},[]);
  return <dialog ref={ref} aria-label={title} onCancel={event=>{event.preventDefault();onClose();}} className="m-auto w-full max-w-xl max-h-[90dvh] rounded-3xl border border-line bg-canvas text-ink p-0 backdrop:bg-black/70"><div className="p-4 sm:p-6"><header className="sticky top-0 z-10 bg-canvas flex items-center justify-between gap-3 mb-5"><h2 className="text-lg font-extrabold">{title}</h2><button type="button" autoFocus onClick={onClose} aria-label={`Fermer ${title}`} className="p-2 rounded-full hover:bg-soft"><X className="w-5 h-5"/></button></header>{children}</div></dialog>;
}
