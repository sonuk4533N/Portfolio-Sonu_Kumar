const crypto = require('crypto');

const SESSION_COOKIE = 'portfolio_admin_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

const sessions = new Map();
const loginAttempts = new Map();

function hash(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function safeEqual(left, right) {
  return crypto.timingSafeEqual(Buffer.from(hash(left)), Buffer.from(hash(right)));
}

function parseCookies(req) {
  return String(req.headers.cookie || '')
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separator = part.indexOf('=');
      if (separator === -1) return cookies;
      cookies[decodeURIComponent(part.slice(0, separator))] = decodeURIComponent(part.slice(separator + 1));
      return cookies;
    }, {});
}

function getSessionToken(req) {
  return parseCookies(req)[SESSION_COOKIE] || null;
}

function getSession(req) {
  const token = getSessionToken(req);
  if (!token) return null;

  const tokenHash = hash(token);
  const session = sessions.get(tokenHash);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(tokenHash);
    return null;
  }
  return { tokenHash, ...session };
}

function buildCookie(token, req, maxAge) {
  const secure = process.env.NODE_ENV === 'production' || req.secure;
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/api',
    `Max-Age=${maxAge}`,
    secure ? 'Secure' : null
  ].filter(Boolean).join('; ');
}

function createSession(req, res) {
  const token = crypto.randomBytes(32).toString('base64url');
  sessions.set(hash(token), { expiresAt: Date.now() + SESSION_TTL_MS });
  res.setHeader('Set-Cookie', buildCookie(token, req, Math.floor(SESSION_TTL_MS / 1000)));
  return SESSION_TTL_MS;
}

function destroySession(req, res) {
  const session = getSession(req);
  if (session) sessions.delete(session.tokenHash);
  res.setHeader('Set-Cookie', buildCookie('', req, 0));
}

function authenticate(req, res, next) {
  const session = getSession(req);
  if (!session) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.adminSession = session;
  next();
}

function getClientKey(req) {
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function getLoginStatus(req) {
  const key = getClientKey(req);
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now - entry.firstAttemptAt >= LOGIN_WINDOW_MS) {
    loginAttempts.delete(key);
    return { allowed: true, key, retryAfterSeconds: 0 };
  }
  if (entry.count < MAX_LOGIN_ATTEMPTS) return { allowed: true, key, retryAfterSeconds: 0 };
  return {
    allowed: false,
    key,
    retryAfterSeconds: Math.max(1, Math.ceil((LOGIN_WINDOW_MS - (now - entry.firstAttemptAt)) / 1000))
  };
}

function recordLoginFailure(key) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now - entry.firstAttemptAt >= LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }
  entry.count += 1;
}

function clearLoginFailures(key) {
  loginAttempts.delete(key);
}

function verifyAdminPassword(password) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) return { configured: false, valid: false };
  return { configured: true, valid: safeEqual(password || '', configuredPassword) };
}

module.exports = {
  authenticate,
  clearLoginFailures,
  createSession,
  destroySession,
  getLoginStatus,
  getSession,
  recordLoginFailure,
  verifyAdminPassword
};
