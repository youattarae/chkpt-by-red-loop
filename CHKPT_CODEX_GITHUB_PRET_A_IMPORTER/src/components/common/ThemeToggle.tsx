import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');
  function toggle() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    try { localStorage.setItem('chkpt_theme', next ? 'dark' : 'light'); } catch { /* The setting still works for this page. */ }
    setDark(next);
  }
  return <button type="button" onClick={toggle} aria-label="Mode sombre" aria-pressed={dark}
    title={dark ? 'Passer au mode clair' : 'Passer au mode sombre'}
    className="theme-toggle p-2 rounded-xl border border-line bg-surface text-muted hover:text-ink cursor-pointer">
    <span className="flex items-center gap-2 text-xs font-semibold">{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{dark ? 'Activé' : 'Désactivé'}</span>
  </button>;
}
