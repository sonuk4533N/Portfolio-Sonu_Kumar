const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/auth');
const { cleanText, validateEmail, validatePhone } = require('../middleware/validation');
const { sendContactEmail } = require('../emailService');

router.post('/', async (req, res) => {
  const name = cleanText(req.body?.name, 120);
  const email = cleanText(req.body?.email, 254);
  const phone = cleanText(req.body?.phone, 30);
  const message = cleanText(req.body?.message, 4000);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  if (!validateEmail(email)) return res.status(400).json({ error: 'Please enter a valid email address' });
  if (!validatePhone(phone)) return res.status(400).json({ error: 'Please enter a valid phone number' });
  if (message.length < 10) return res.status(400).json({ error: 'Message must be at least 10 characters' });

  db.run(
    'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
    [name, email, phone || null, message],
    async function onInsert(err) {
      if (err) return res.status(500).json({ error: err.message });

      const emailResult = await sendContactEmail(name, email, phone, message);
      if (emailResult.success) return res.json({ success: true, message_id: this.lastID });

      res.json({
        success: true,
        warning: 'Message saved but email could not be sent. Please check your email configuration.',
        message_id: this.lastID
      });
    }
  );
});

router.get('/messages', authenticate, (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

router.patch('/messages/:id/read', authenticate, (req, res) => {
  const isRead = req.body?.is_read === false || req.body?.is_read === 0 ? 0 : 1;
  db.run('UPDATE contact_messages SET is_read = ? WHERE id = ?', [isRead, req.params.id], function onUpdate(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true, is_read: Boolean(isRead) });
  });
});

router.delete('/messages/:id', authenticate, (req, res) => {
  db.run('DELETE FROM contact_messages WHERE id = ?', [req.params.id], function onDelete(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true, message: 'Message deleted successfully' });
  });
});

module.exports = router;
