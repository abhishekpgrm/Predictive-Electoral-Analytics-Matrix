const mongoose = require('mongoose');

const demographicsSchema = new mongoose.Schema({
  constituency: { type: String, required: true, unique: true },
  caste_distribution: { type: Map, of: Number },
  religion_distribution: { type: Map, of: Number },
  
  // Turnout scenarios
  expected_turnout: { type: Number, default: 65, min: 0, max: 100 },
  swing_voter_percentage: { type: Number, default: 15, min: 0, max: 100 },
  
  // Hyper-local breakdown
  urban_rural_split: {
    urban: { type: Number, default: 50 },
    rural: { type: Number, default: 50 }
  },
  
  // Ward/booth level (optional detailed tracking)
  total_wards: { type: Number, default: 0 },
  total_booths: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Demographics', demographicsSchema);
