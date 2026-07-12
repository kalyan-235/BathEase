const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');
const { sendAdminWhatsApp } = require('../config/whatsapp');

// POST /api/bookings — create booking (auth required)
router.post('/', protect, async (req, res) => {
  try {
    const {
      bookingId, bathroomCount, miniServices, date, slot,
      address, whatsapp, paymentMethod, price, lat, lng,
    } = req.body;

    if (!address || !whatsapp || !date || !slot) {
      return res.status(400).json({ error: 'Missing required fields: address, whatsapp, date, slot' });
    }
    if (!bathroomCount || bathroomCount < 1) {
      return res.status(400).json({ error: 'bathroomCount must be at least 1' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ error: 'paymentMethod is required' });
    }

    const booking = await Booking.create({
      bookingId,
      userEmail: req.user.email,
      userId: req.user._id,
      bathroomCount,
      miniServices: miniServices || [],
      date,
      slot,
      address,
      whatsapp,
      location: { lat: lat || null, lng: lng || null },
      paymentMethod,
      status: 'confirmed',
      price,
    });

    // Notify admin on WhatsApp (non-blocking — won't fail the booking)
    sendAdminWhatsApp(booking).catch(() => {});

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/test-whatsapp — admin only, sends a test message
router.get('/test-whatsapp', protect, adminOnly, async (req, res) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, ADMIN_WHATSAPP } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !ADMIN_WHATSAPP) {
    return res.status(400).json({
      error: 'Twilio env vars missing',
      missing: {
        TWILIO_ACCOUNT_SID: !TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN:  !TWILIO_AUTH_TOKEN,
        TWILIO_WHATSAPP_FROM: !TWILIO_WHATSAPP_FROM,
        ADMIN_WHATSAPP:     !ADMIN_WHATSAPP,
      }
    });
  }

  try {
    const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    await twilio.messages.create({
      body: '✅ BathEase test — WhatsApp notifications are working!',
      from: TWILIO_WHATSAPP_FROM,
      to:   ADMIN_WHATSAPP,
    });
    res.json({ success: true, message: `Test message sent to ${ADMIN_WHATSAPP}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/my — get logged-in user's bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings — get all bookings (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/bookings/:id — update status or assigned staff (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, assignedStaff } = req.body;
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (status) booking.status = status;
    if (assignedStaff !== undefined) booking.assignedStaff = assignedStaff;

    const updated = await booking.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/bookings/:id/review — add review to completed booking (auth required)
router.put('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findOne({ bookingId: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    booking.review = { rating, comment };
    const updated = await booking.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/bookings/:id/cancel — cancel a booking (auth required)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel a booking that is already completed or cancelled' });
    }

    booking.status = 'cancelled';
    const updated = await booking.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
