import { useRef, useState } from 'react';
import { Share2, Copy, X } from 'lucide-react';
import { Place } from '../../types';

export function PlaceShare({ place }: { place: Place }) {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const input = useRef<HTMLInputElement>(null);
  // A venue link contains no session, query parameters, coordinates or visit history.
  const url = new URL(window.location.pathname, window.location.origin);
  url.hash = new URLSearchParams({ lieu: place.id }).toString();
  const text = `${place.name} · ${place.commune} — Lieu fictif de démonstration CHKPT. Lien de démo privée : accès au serveur requis.`;
  async function share() {
    setNotice('');
    if (navigator.share) {
      try { await navigator.share({ title: place.name, text, url: url.href }); return; }
      catch (error) { if (error instanceof Error && error.name === 'AbortError') return; }
    }
    setOpen(true);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(url.href);
      setNotice('Lien copié.');
    } catch {
      input.current?.focus();
      input.current?.select();
      setNotice('Sélectionnez puis copiez le lien ci-dessus avec le menu de votre appareil.');
    }
  }
  return <>
    <button type="button" onClick={share} aria-label="Partager cet établissement" className="pointer-events-auto p-2.5 bg-black/65 text-white rounded-full cursor-pointer"><Share2 className="w-5 h-5" /></button>
    {open && <section aria-label="Partager le lieu" className="pointer-events-auto absolute top-14 right-0 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-line bg-canvas text-ink p-4 shadow-xl space-y-3">
      <div className="flex justify-between items-center gap-2"><h3 className="text-sm font-bold">Partager le lieu</h3><button type="button" aria-label="Fermer le partage" onClick={() => setOpen(false)} className="p-1 cursor-pointer"><X className="w-4 h-4" /></button></div>
      <p className="text-xs text-body">{text}</p>
      <p className="text-xs text-muted">Démo privée : le destinataire doit avoir accès au serveur CHKPT, sur le même réseau si vous utilisez votre Mac.</p>
      <label className="block text-xs font-semibold">Lien de la fiche<input ref={input} readOnly value={url.href} className="block w-full mt-1 rounded-lg border border-line bg-soft text-ink p-2 text-xs" /></label>
      <button type="button" onClick={copy} className="flex items-center gap-2 text-xs font-bold text-blue-400 py-2 cursor-pointer"><Copy className="w-4 h-4" />Copier le lien</button>
      <div className="flex flex-wrap gap-4 text-xs font-bold text-blue-400">
        <a href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url.href}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href={`mailto:?subject=${encodeURIComponent(place.name)}&body=${encodeURIComponent(`${text}\n${url.href}`)}`}>E-mail</a>
      </div>
      <p role="status" className="text-xs text-muted">{notice}</p>
    </section>}
  </>;
}
