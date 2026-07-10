const express  = require('express');
const router   = express.Router();
const Content  = require('../models/Content');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET /api/content/:type  — public (frontend reads this) ──────────────────
router.get('/:type', async (req, res) => {
  try {
    const doc = await Content.findOne({ type: req.params.type });
    res.json(doc ? doc.items : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/content/:type  — admin: replace entire list ────────────────────
router.put('/:type', protect, adminOnly, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items must be an array' });
    }
    const doc = await Content.findOneAndUpdate(
      { type: req.params.type },
      { items },
      { upsert: true, new: true }
    );
    res.json(doc.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
