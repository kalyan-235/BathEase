const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

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
