import { useState } from 'react';
import { useStore } from '../../services/store';
export function BackupControls(){
  const {authSessionToken}=useStore();
  const [password,setPassword]=useState('');const [confirmation,setConfirmation]=useState('');
  const [file,setFile]=useState<File|null>(null);const [pending,setPending]=useState(false);const [notice,setNotice]=useState('');
  async function exportBackup(){
    setPending(true);setNotice('');
    try{const response=await fetch('/api/demo/backup',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${authSessionToken}`},body:JSON.stringify({password})});if(!response.ok)throw new Error('Export impossible. Vérifiez votre accès opérateur.');const url=URL.createObjectURL(await response.blob());const link=document.createElement('a');link.href=url;link.download=`CHKPT-${new Date().toISOString().slice(0,10)}.chkpt`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setPassword('');setNotice('Sauvegarde chiffrée téléchargée. Conservez son mot de passe séparément.');}
    catch(error){setNotice(error instanceof Error?error.message:'Export indisponible.');}finally{setPending(false);}
  }
  async function restore(){
    if(!file)return;setPending(true);setNotice('');
    try{const response=await fetch('/api/demo/restore',{method:'POST',headers:{'Content-Type':'application/octet-stream',Authorization:`Bearer ${authSessionToken}`,'X-Backup-Password':encodeURIComponent(password),'X-Confirm-Restore':'REPLACE_DEMO_DATA'},body:file});if(!response.ok)throw new Error('Restauration refusée. Vérifiez le fichier et le mot de passe.');sessionStorage.setItem('chkpt_restore_notice','Sauvegarde restaurée. Reconnectez-vous : les anciennes sessions ont été fermées.');window.location.reload();}
    catch(error){setNotice(error instanceof Error?error.message:'Restauration indisponible.');setPending(false);}
  }
  return <details className="border border-line rounded-xl p-3"><summary className="text-sm font-semibold cursor-pointer">Sauvegarde privée de la démo</summary><div className="space-y-3 mt-3">
    <p className="text-xs text-muted">Budget gratuit : téléchargez une sauvegarde avant une présentation. Le fichier contient les données privées de démonstration, chiffrées par votre mot de passe. Une clé perdue ne peut pas être récupérée.</p>
    <label className="block text-xs font-semibold">Mot de passe de sauvegarde<input type="password" autoComplete="off" value={password} onChange={event=>setPassword(event.target.value)} minLength={16} maxLength={256} className="block w-full p-2 mt-1 bg-soft rounded-lg border border-line" /></label>
    <button type="button" disabled={pending||password.length<16} onClick={exportBackup} className="w-full p-3 rounded-xl bg-blue-600 text-white text-xs font-bold disabled:opacity-50 cursor-pointer">Télécharger une sauvegarde chiffrée</button>
    <p className="text-xs text-rose-400">Restaurer remplace toutes les données de la démo et ferme les sessions. Ne le faites pas pendant une présentation ou pendant que des personnes publient.</p>
    <label className="block text-xs font-semibold">Fichier de sauvegarde<input type="file" accept=".chkpt" onChange={event=>setFile(event.target.files?.[0]||null)} className="block w-full text-xs mt-1" /></label>
    <label className="block text-xs font-semibold">Tapez REMPLACER LA DÉMO<input value={confirmation} onChange={event=>setConfirmation(event.target.value)} className="block w-full p-2 mt-1 bg-soft rounded-lg border border-line" /></label>
    <button type="button" onClick={restore} disabled={pending||!file||password.length<16||confirmation!=='REMPLACER LA DÉMO'} className="w-full p-3 rounded-xl bg-soft text-rose-400 text-xs font-bold disabled:opacity-50 cursor-pointer">Restaurer cette sauvegarde</button><p role="status" className="text-xs text-body">{notice}</p>
  </div></details>;
}
