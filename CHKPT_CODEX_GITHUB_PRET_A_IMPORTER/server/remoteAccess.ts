import { Express, Request, Response } from 'express';
import crypto from 'node:crypto';
import 'dotenv/config';

export function installRemoteAccess(app: Express) {
  if (process.env.CHKPT_REMOTE_ACCESS !== 'true') return;
  const password = process.env.CHKPT_ACCESS_PASSWORD || '';
  if (process.env.CHKPT_PRIVATE_DEMO !== 'true' || password.length < 16 || password.length > 256 || password === process.env.CHKPT_DEMO_ADMIN_PASSWORD) {
    throw new Error('Remote access requires private demo and a distinct CHKPT_ACCESS_PASSWORD (at least 16 characters).');
  }
  // Render terminates TLS and overwrites the forwarded protocol at its proxy.
  app.set('trust proxy', 1);
  const salt = crypto.randomBytes(16);
  const digest = crypto.scryptSync(password, salt, 64);
  const sessions = new Map<string, number>();
  const attempts = new Map<string, { count: number; until: number }>();
  const cookie = '__Host-chkpt_access';
  const ttl = 8 * 60 * 60 * 1000;
  const tokenOf = (req: Request) => req.headers.cookie?.split(';').map(item => item.trim()).find(item => item.startsWith(cookie + '='))?.slice(cookie.length + 1) || '';
  function page(res: Response, error = '', status = 200) {
    res.status(status).type('html').send(`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Accès privé CHKPT</title><style>body{margin:0;background:#f4f7fb;color:#09162d;font:16px system-ui;min-height:100dvh;display:grid;place-items:center}main{margin:20px;padding:28px;border-radius:24px;background:white;max-width:380px;box-shadow:0 12px 50px #07182f15}input,button{box-sizing:border-box;width:100%;padding:14px;border-radius:12px;margin-top:10px;font:inherit}input{border:1px solid #b2bfd0}button{background:#005bdd;color:white;border:0;cursor:pointer}p{line-height:1.6;font-size:14px}label{font-size:14px}strong{color:#a70035}</style><main><h1>Bienvenue sur CHKPT</h1><p>Démonstration privée · données fictives.<br>Entrez le mot de passe d’accès communiqué par l’organisateur.</p>${error ? `<p role="alert"><strong>${error}</strong></p>` : ''}<form method="post" action="/demo-access"><label>Mot de passe d’accès<input name="password" type="password" required maxlength="256" autocomplete="current-password"></label><button>Ouvrir la démonstration</button></form><script>const place = new URLSearchParams(location.hash.slice(1)).get('lieu'); if (place && /^[a-zA-Z0-9_-]{1,100}$/.test(place)) { const field = document.createElement('input'); field.type = 'hidden'; field.name = 'place'; field.value = place; document.querySelector('form').append(field); }</script><p>Ce mot de passe ne donne pas les droits opérateur.</p></main></html>`);
  }
  // This middleware precedes body parsing, API routes and all static assets.
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://wa.me");
    if (!req.secure) { res.status(426).type('text').send('Utilisez le lien HTTPS privé de la démonstration.'); return; }
    const now = Date.now();
    for (const [key, expiry] of sessions) if (expiry < now) sessions.delete(key);
    for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
    const token = tokenOf(req);
    if (req.path === '/demo-access/logout' && req.method === 'POST') {
      sessions.delete(token);
      res.clearCookie(cookie, { secure: true, httpOnly: true, sameSite: 'strict', path: '/' });
      res.redirect(303, '/'); return;
    }
    if (sessions.has(token)) { next(); return; }
    if (req.path === '/demo-access' && req.method === 'POST') {
      if (req.headers.origin && req.headers.origin !== `https://${req.get('host')}`) { res.status(403).end(); return; }
      const key = req.ip || 'unknown';
      const attempt = attempts.get(key) || { count: 0, until: now + 60_000 };
      if (attempt.count >= 5 || attempts.size >= 1000) { res.setHeader('Retry-After', '60'); page(res, 'Trop de tentatives. Réessayez dans une minute.', 429); return; }
      attempts.set(key, { ...attempt, count: attempt.count + 1 });
      // Only this small form body is parsed before authentication.
      let body = ''; let oversized = false;
      req.on('data', chunk => { body += chunk; if (body.length > 2048) { oversized = true; body = ''; } });
      req.on('end', () => {
        if (oversized) { res.status(413).end(); return; }
        const candidate = new URLSearchParams(body).get('password') || '';
        if (candidate.length > 256 || !crypto.timingSafeEqual(crypto.scryptSync(candidate, salt, 64), digest)) { page(res, 'Mot de passe incorrect.', 401); return; }
        if (sessions.size >= 1000) { page(res, 'Démonstration occupée. Réessayez plus tard.', 503); return; }
        attempts.delete(key);
        const session = crypto.randomBytes(32).toString('hex');
        sessions.set(session, now + ttl);
        res.cookie(cookie, session, { secure: true, httpOnly: true, sameSite: 'strict', path: '/', maxAge: ttl });
        const place = new URLSearchParams(body).get('place') || '';
        res.redirect(303, /^[a-zA-Z0-9_-]{1,100}$/.test(place) ? '/#lieu=' + encodeURIComponent(place) : '/');
      });
      return;
    }
    if (req.path.startsWith('/api/') || req.path.startsWith('/assets/') || req.path.startsWith('/illustrations/')) { res.status(401).json({ error: 'private_access_required' }); return; }
    page(res);
  });
}
