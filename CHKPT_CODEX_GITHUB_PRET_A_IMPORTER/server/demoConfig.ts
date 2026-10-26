import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';

// Only the server can enable the private presentation tools. Client flags are UI only.
export const privateDemoEnabled = process.env.CHKPT_PRIVATE_DEMO === 'true';
export const demoAdminPassword = process.env.CHKPT_DEMO_ADMIN_PASSWORD;
export const seedUserIds = new Set(['usr_01', 'usr_sarah', 'usr_admin']);

if (privateDemoEnabled && (!demoAdminPassword || demoAdminPassword.length < 16)) {
  throw new Error('Private demo requires CHKPT_DEMO_ADMIN_PASSWORD (at least 16 characters).');
}

export function requirePrivateDemo(_req: Request, res: Response, next: NextFunction): void {
  if (!privateDemoEnabled) {
    res.status(403).json({ error: 'private_demo_disabled', message: 'Outils de démonstration désactivés sur ce serveur.' });
    return;
  }
  next();
}
