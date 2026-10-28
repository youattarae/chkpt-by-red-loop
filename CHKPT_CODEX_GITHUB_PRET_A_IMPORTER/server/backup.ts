import { Express, raw } from 'express';
import crypto from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { db, databaseDirectory } from './db';
import { requirePrivateDemo } from './demoConfig';
import { requireAuth } from './auth';
function passwordValid(value:unknown):value is string{return typeof value==='string'&&value.length>=16&&value.length<=256;}
function encrypt(data:unknown,password:string){
  const salt=crypto.randomBytes(16),iv=crypto.randomBytes(12),key=crypto.scryptSync(password,salt,32);
  const cipher=crypto.createCipheriv('aes-256-gcm',key,iv);
  const content=Buffer.concat([cipher.update(gzipSync(Buffer.from(JSON.stringify(data)))),cipher.final()]);
  return Buffer.from(JSON.stringify({format:'chkpt-backup-v1',salt:salt.toString('base64'),iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),content:content.toString('base64')}));
}
function decrypt(file:Buffer,password:string){
  const envelope=JSON.parse(file.toString('utf8'));
  if(envelope.format!=='chkpt-backup-v1')throw new Error('Invalid format');
  const salt=Buffer.from(envelope.salt,'base64'),iv=Buffer.from(envelope.iv,'base64'),tag=Buffer.from(envelope.tag,'base64');
  if(salt.length!==16||iv.length!==12||tag.length!==16)throw new Error('Invalid format');
  const cipher=crypto.createDecipheriv('aes-256-gcm',crypto.scryptSync(password,salt,32),iv);cipher.setAuthTag(tag);
  const plain=Buffer.concat([cipher.update(Buffer.from(envelope.content,'base64')),cipher.final()]);
  return JSON.parse(gunzipSync(plain,{maxOutputLength:100*1024*1024}).toString('utf8'));
}
export function installBackupRoutes(app:Express){
  const admin=(req:any,res:any,next:any)=>{if(!['admin','superadmin'].includes(req.user!.role)){res.status(403).json({error:'backup_admin_only'});return;}next();};
  app.post('/api/demo/backup',requirePrivateDemo,requireAuth,admin,(req,res)=>{
    const password=req.body?.password;if(!passwordValid(password)){res.status(400).json({error:'backup_password_required',message:'Choisissez un mot de passe de 16 à 256 caractères.'});return;}
    const file=encrypt({...db.getRawData(),sessions:[]},password);
    res.setHeader('Content-Disposition',`attachment; filename="CHKPT-${new Date().toISOString().slice(0,10)}.chkpt"`);res.type('application/octet-stream').send(file);
  });
  app.post('/api/demo/restore',requirePrivateDemo,requireAuth,admin,raw({type:'application/octet-stream',limit:'80mb'}),(req,res)=>{
    const session=db.findSession(req.sessionToken||'');
    if(!session||session.userId!==req.user!.id){res.status(401).json({error:'session_expired'});return;}
    let password:string;
    try{password=decodeURIComponent(String(req.get('X-Backup-Password')||''));}catch{res.status(400).json({error:'invalid_backup_password'});return;}
    if(!passwordValid(password)||req.get('X-Confirm-Restore')!=='REPLACE_DEMO_DATA'||!Buffer.isBuffer(req.body)){res.status(400).json({error:'restore_confirmation_required'});return;}
    try{
      const restored=decrypt(req.body,password);
      db.validateSnapshot(restored);
      const safety=encrypt({...db.getRawData(),sessions:[]},password);
      const directory=path.join(databaseDirectory,'restore-safety');fs.mkdirSync(directory,{recursive:true});
      fs.writeFileSync(path.join(directory,`before-${Date.now()}.chkpt`),safety,{mode:0o600});
      db.restoreSnapshot(restored);
      try{const older=fs.readdirSync(directory).filter(name=>/^before-\d+\.chkpt$/.test(name)).sort().slice(0,-3);for(const name of older)fs.unlinkSync(path.join(directory,name));}catch{/* Safety-file cleanup must not turn a completed restore into an error. */}
      res.json({success:true,message:'Sauvegarde restaurée. Les sessions sont fermées : reconnectez-vous.'});
    }catch{res.status(400).json({error:'restore_failed',message:'Fichier ou mot de passe incorrect. Les données actuelles sont conservées.'});}
  });
}
