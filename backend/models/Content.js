const mongoose = require('mongoose');

// Generic content store — one document per content type (singleton pattern)
// type: 'packages' | 'miniServices' | 'valueDeals' | 'offers' | 'cleaningRequirements'
const contentSchema = new mongoose.Schema({
  type:  { type: String, required: true, unique: true },
  items: { type: mongoose.Schema.Types.Mixed, required: true, default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
