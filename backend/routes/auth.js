const express = require('express');
const {
  clearLoginFailures,
  createSession,
  destroySession,
  getLoginStatus,
  getSession,
  recordLoginFailure,
  verifyAdminPassword
} = require('../middleware/auth');

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

router.post('/login', (req, res) => {
  const loginStatus = getLoginStatus(req);
  if (!loginStatus.allowed) {
    res.setHeader('Retry-After', String(loginStatus.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  const result = verifyAdminPassword(req.body?.password);
  if (!result.configured) return res.status(503).json({ error: 'Admin access is not configured.' });
  if (!result.valid) {
    recordLoginFailure(loginStatus.key);
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  clearLoginFailures(loginStatus.key);
  const expiresInMs = createSession(req, res);
  res.json({ success: true, expires_in: Math.floor(expiresInMs / 1000) });
});

router.get('/session', (req, res) => {
  res.json({ authenticated: Boolean(getSession(req)) });
});

router.post('/logout', (req, res) => {
  destroySession(req, res);
  res.json({ success: true });
});

module.exports = router;
