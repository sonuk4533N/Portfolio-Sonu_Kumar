const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/auth');
const { cleanText } = require('../middleware/validation');

function experiencePayload(body = {}) {
  const payload = {
    title: cleanText(body.title, 140),
    company: cleanText(body.company, 140),
    description: cleanText(body.description, 1600),
    period: cleanText(body.period, 100),
    type: body.type === 'Education' ? 'Education' : 'Work'
  };
  if (!payload.title) return { error: 'title is required' };
  return { payload };
}

router.get('/', (req, res) => {
  db.all('SELECT * FROM experiences ORDER BY created_at ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

router.post('/', authenticate, (req, res) => {
  const parsed = experiencePayload(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const experience = parsed.payload;

  db.run(
    'INSERT INTO experiences (title, company, description, period, type) VALUES (?, ?, ?, ?, ?)',
    [
      experience.title,
      experience.company || null,
      experience.description || null,
      experience.period || null,
      experience.type
    ],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

router.put('/:id', authenticate, (req, res) => {
  const parsed = experiencePayload(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const experience = parsed.payload;

  db.run(
    `UPDATE experiences
     SET title = ?, company = ?, description = ?, period = ?, type = ?
     WHERE id = ?`,
    [
      experience.title,
      experience.company || null,
      experience.description || null,
      experience.period || null,
      experience.type,
      req.params.id
    ],
    function onUpdate(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Experience not found' });
      res.json({ success: true });
    }
  );
});

router.delete('/:id', authenticate, (req, res) => {
  db.run('DELETE FROM experiences WHERE id = ?', [req.params.id], function onDelete(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Experience not found' });
    res.json({ success: true });
  });
});

module.exports = router;
