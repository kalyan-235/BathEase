const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/users/contact  — public, returns admin contact info only
router.get('/contact', async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('whatsapp email name');
    res.json({
      whatsapp: admin?.whatsapp || '',
      email:    admin?.email    || 'support@bathease.in',
      name:     admin?.name     || 'BathEase Support',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users  (admin only — list all users)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password -resetOtp -resetOtpExpires').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, whatsapp, address, location, profileImage } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (whatsapp !== undefined) user.whatsapp = whatsapp;
    if (address !== undefined) user.address = address;
    if (location !== undefined) user.location = location;
    if (profileImage !== undefined) user.profileImage = profileImage;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      whatsapp: updated.whatsapp,
      address: updated.address,
      location: updated.location,
      profileImage: updated.profileImage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
