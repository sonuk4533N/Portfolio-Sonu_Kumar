const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/auth');
const { cleanText, validateEmail, validatePhone, validateUrl } = require('../middleware/validation');

router.get('/', (req, res) => {
  db.get('SELECT * FROM profile WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

function saveProfile(req, res) {
  const profile = {
    bio: cleanText(req.body?.bio, 1600),
    email: cleanText(req.body?.email, 254),
    phone: cleanText(req.body?.phone, 30),
    github_url: cleanText(req.body?.github_url, 500),
    linkedin_url: cleanText(req.body?.linkedin_url, 500)
  };

  if (profile.email && !validateEmail(profile.email)) return res.status(400).json({ error: 'email is invalid' });
  if (!validatePhone(profile.phone)) return res.status(400).json({ error: 'phone is invalid' });
  if (!validateUrl(profile.github_url)) return res.status(400).json({ error: 'github_url is invalid' });
  if (!validateUrl(profile.linkedin_url)) return res.status(400).json({ error: 'linkedin_url is invalid' });

  db.run(
    `INSERT INTO profile (id, bio, email, phone, github_url, linkedin_url)
     VALUES (1, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       bio = excluded.bio,
       email = excluded.email,
       phone = excluded.phone,
       github_url = excluded.github_url,
       linkedin_url = excluded.linkedin_url,
       updated_at = CURRENT_TIMESTAMP`,
    [profile.bio || null, profile.email || null, profile.phone || null, profile.github_url || null, profile.linkedin_url || null],
    function onSave(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
}

router.post('/', authenticate, saveProfile);
router.put('/', authenticate, saveProfile);

module.exports = router;
