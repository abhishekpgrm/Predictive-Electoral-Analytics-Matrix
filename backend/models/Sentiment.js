const mongoose = require('mongoose');

const sentimentSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  candidate_id: { type: String },
  positive: { type: Number, required: true },
  negative: { type: Number, required: true },
  neutral: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sentiment', sentimentSchema);
