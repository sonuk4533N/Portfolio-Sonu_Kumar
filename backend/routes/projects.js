const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/auth');
const { cleanText, validateUrl } = require('../middleware/validation');

const PROJECT_CATEGORIES = new Set(['web', 'mobile', 'design']);

function parseTags(tags) {
  const values = Array.isArray(tags) ? tags : String(tags || '').split(',');
  return values.map(tag => cleanText(tag, 40)).filter(Boolean).slice(0, 12);
}

function parseStoredTags(tags) {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return parseTags(tags);
  }
}

function normalizeCategory(category) {
  const value = cleanText(category, 20).toLowerCase();
  return PROJECT_CATEGORIES.has(value) ? value : 'web';
}

function validMediaUrl(value) {
  return !value || validateUrl(value) || /^(\/|images\/)/.test(value);
}

function projectPayload(body = {}) {
  const payload = {
    title: cleanText(body.title, 120),
    description: cleanText(body.description, 1200),
    tags: parseTags(body.tags),
    category: normalizeCategory(body.category),
    image_url: cleanText(body.image_url, 500),
    github_url: cleanText(body.github_url, 500),
    live_url: cleanText(body.live_url, 500)
  };

  if (!payload.title) return { error: 'title is required' };
  if (!validMediaUrl(payload.image_url)) return { error: 'image_url must be an HTTP(S) or local image URL' };
  if (!validateUrl(payload.github_url)) return { error: 'github_url must be a valid HTTP(S) URL' };
  if (!validateUrl(payload.live_url)) return { error: 'live_url must be a valid HTTP(S) URL' };
  return { payload };
}

router.get('/', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json((rows || []).map(project => ({
      ...project,
      category: normalizeCategory(project.category),
      tags: parseStoredTags(project.tags),
      image: project.image_url || null
    })));
  });
});

router.post('/', authenticate, (req, res) => {
  const parsed = projectPayload(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const project = parsed.payload;

  db.run(
    `INSERT INTO projects
      (title, description, tags, category, image_url, github_url, live_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      project.title,
      project.description || null,
      JSON.stringify(project.tags),
      project.category,
      project.image_url || null,
      project.github_url || null,
      project.live_url || null
    ],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

router.put('/:id', authenticate, (req, res) => {
  const parsed = projectPayload(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const project = parsed.payload;

  db.run(
    `UPDATE projects
     SET title = ?, description = ?, tags = ?, category = ?, image_url = ?, github_url = ?, live_url = ?
     WHERE id = ?`,
    [
      project.title,
      project.description || null,
      JSON.stringify(project.tags),
      project.category,
      project.image_url || null,
      project.github_url || null,
      project.live_url || null,
      req.params.id
    ],
    function onUpdate(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
      res.json({ success: true });
    }
  );
});

router.delete('/:id', authenticate, (req, res) => {
  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function onDelete(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  });
});

module.exports = router;
