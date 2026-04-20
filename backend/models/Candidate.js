const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  incumbent: { type: Boolean, default: false },
  past_votes: { type: Number, default: 0 },
  criminal_cases: { type: Number, default: 0 },
  assets: { type: Number, default: 0 },
  constituency: { type: String, required: true },
  
  // Personal Base (separate from party)
  personal_base_score: { type: Number, default: 0.5, min: 0, max: 1 },
  victory_margins: [{ type: Number }], // Historical victory margins
  local_influence: { type: Number, default: 0.5, min: 0, max: 1 },
  
  // Past Work (OSINT)
  past_work: {
    bills_passed: { type: Number, default: 0 },
    fund_utilization: { type: Number, default: 0, min: 0, max: 100 }, // Percentage
    projects_completed: { type: Number, default: 0 },
    attendance_rate: { type: Number, default: 0, min: 0, max: 100 } // Percentage
  },
  
  // Anti-Incumbency
  anti_incumbency_score: { type: Number, default: 0, min: 0, max: 1 },
  time_in_office: { type: Number, default: 0 }, // Years
  
  // Hyper-Local
  community_type: { type: String, enum: ['Urban', 'Rural', 'Semi-Urban', 'Tribal', 'Mixed'], default: 'Mixed' },
  minority_appeal: { type: Number, default: 0.5, min: 0, max: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
