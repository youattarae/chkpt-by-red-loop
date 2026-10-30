/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CHKPT by RED LOOP — Authentication & Access Control Middlewares
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { privateDemoEnabled, seedUserIds } from './demoConfig';
import { db, UserEntity } from './db';

// Extend Express Request interface with authenticated user and token
declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
      sessionToken?: string;
    }
  }
}

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Middleware: Resolves session token and attaches user to req.user if valid
 */
export function authenticateUser(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    next();
    return;
  }

  const session = db.findSession(token);
  if (!session) {
    next();
    return;
  }

  const user = db.findUserById(session.userId);
  if (user && (privateDemoEnabled || !seedUserIds.has(user.id))) {
    req.user = user;
    req.sessionToken = token;
  }

  next();
}

/**
 * Middleware: Requires a valid active session
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      error: 'unauthorized',
      message: 'Authentification requise pour effectuer cette action.',
    });
    return;
  }
  next();
}

/**
 * Middleware: Requires operator role (admin, superadmin, moderator)
 */
export function requireOperator(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      error: 'unauthorized',
      message: 'Authentification requise pour accéder aux fonctions d\'exploitation.',
    });
    return;
  }

  const allowedRoles = ['admin', 'superadmin', 'moderator'];
  if (!allowedRoles.includes(req.user.role)) {
    res.status(403).json({
      error: 'forbidden_operator_access',
      message: 'Accès refusé : espace réservé aux équipes d\'exploitation RED LOOP.',
      userRole: req.user.role,
    });
    return;
  }

  next();
}
