const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/auth');
const { cleanText } = require('../middleware/validation');

const CATEGORY_ICONS = {
  'Front-End': '🖥️',
  'Back-End': '⚙️',
  Database: '🗄️',
  'Developer Tools': '🛠️',
  'Design Tools': '🎨',
  Other: '🔧'
};

const CATEGORY_ALIASES = {
  Frontend: 'Front-End',
  Backend: 'Back-End',
  Tools: 'Developer Tools'
};

function normalizeCategory(category) {
  const value = cleanText(category, 40) || 'Other';
  const normalized = CATEGORY_ALIASES[value] || value;
  return CATEGORY_ICONS[normalized] ? normalized : 'Other';
}

function skillPayload(body = {}) {
  const name = cleanText(body.name, 80);
  if (!name) return { error: 'name is required' };
  const proficiency = Number.isFinite(Number(body.proficiency))
    ? Math.min(5, Math.max(1, Number(body.proficiency)))
    : 3;
  return { payload: { name, category: normalizeCategory(body.category), proficiency } };
}

router.get('/', (req, res) => {
  db.all('SELECT * FROM skills ORDER BY category, name', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const grouped = new Map();
    (rows || []).forEach(row => {
      const category = normalizeCategory(row.category);
      if (!grouped.has(category)) {
        grouped.set(category, { category, icon: CATEGORY_ICONS[category], skills: [] });
      }
      grouped.get(category).skills.push({ id: row.id, name: row.name, proficiency: row.proficiency });
    });
    res.json(Array.from(grouped.values()));
  });
});

router.post('/', authenticate, (req, res) => {
  const parsed = skillPayload(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const skill = parsed.payload;

  db.run(
    'INSERT INTO skills (name, category, proficiency) VALUES (?, ?, ?)',
    [skill.name, skill.category, skill.proficiency],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

router.put('/:id', authenticate, (req, res) => {
  const parsed = skillPayload(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const skill = parsed.payload;

  db.run(
    'UPDATE skills SET name = ?, category = ?, proficiency = ? WHERE id = ?',
    [skill.name, skill.category, skill.proficiency, req.params.id],
    function onUpdate(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Skill not found' });
      res.json({ success: true });
    }
  );
});

router.delete('/:id', authenticate, (req, res) => {
  db.run('DELETE FROM skills WHERE id = ?', [req.params.id], function onDelete(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json({ success: true });
  });
});

module.exports = router;
