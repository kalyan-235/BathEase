const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  bathroomCount: Number,
  bathroomSubtotal: Number,
  miniSubtotal: Number,
  subtotal: Number,
  bathroomDiscount: Number,
  bundleDiscount: Number,
  couponDiscount: Number,
  couponCode: String,
  taxes: Number,
  total: Number,
  offersApplied: [String],
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true }, // BE-XXXX format
  userEmail: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bathroomCount: { type: Number, required: true, min: 1 },
  miniServices: [String],
  date: { type: String, required: true },
  slot: { type: String, required: true },
  address: { type: String, required: true },
  whatsapp: { type: String, required: true },
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  paymentMethod: { type: String, enum: ['razorpay', 'upi', 'cash'], required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'confirmed',
  },
  assignedStaff: { type: String, default: '' },
  price: priceSchema,
  review: reviewSchema,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
