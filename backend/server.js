const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const frontendPath = path.join(__dirname, '..', 'frontend');
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.path === '/admin.html' || req.path.startsWith('/api/auth')) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});
app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  next();
});
app.use(express.json({ limit: '100kb' }));
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next(err);
});

app.use(express.static(frontendPath, { extensions: ['html'] }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/profile', require('./routes/profile'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);
  const status = err.message === 'Origin is not allowed by CORS' ? 403 : 500;
  res.status(status).json({ error: status === 403 ? err.message : 'Internal server error' });
});

function startServer(port = process.env.PORT || 5000) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${server.address().port}`);
  });
  return server;
}

if (require.main === module) startServer();

module.exports = { app, startServer };
