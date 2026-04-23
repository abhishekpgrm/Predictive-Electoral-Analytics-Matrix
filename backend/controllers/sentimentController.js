const mongoose = require('mongoose');
const Sentiment = require('../models/Sentiment');
const { isDBConnected } = require('../config/db');
const { sentiments: dummySentiments } = require('../data/dummyData');

// GET /api/sentiment — fetch sentiments (with optional ?candidate_id= filter)
exports.getSentiments = async (req, res, next) => {
  try {
    const { candidate_id } = req.query;

    if (isDBConnected()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(candidate_id);
      let filter = {};
      
      if (candidate_id) {
        if (isObjectId) {
          filter = { candidate: candidate_id };
        } else {
          filter = { candidate_id: candidate_id };
        }
      }
      
      const sentiments = await Sentiment.find(filter);
      return res.json({ success: true, data: sentiments });
    }

    let data = [...dummySentiments];
    if (candidate_id) {
      data = data.filter(s => s.candidate_id === candidate_id);
    }
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/sentiment — create sentiment entry
exports.createSentiment = async (req, res, next) => {
  try {
    const { positive, negative, neutral } = req.body;
    if (positive == null || negative == null || neutral == null) {
      return res.status(400).json({
        success: false,
        error: 'positive, negative, and neutral are required'
      });
    }

    if (isDBConnected()) {
      const sentiment = await Sentiment.create(req.body);
      return res.status(201).json({ success: true, data: sentiment });
    }

    const newSentiment = {
      _id: String(dummySentiments.length + 1),
      ...req.body
    };
    dummySentiments.push(newSentiment);
    return res.status(201).json({ success: true, data: newSentiment });
  } catch (err) {
    next(err);
  }
};

// PUT /api/sentiment/update — update sentiment (for scenario simulation)
exports.updateSentiment = async (req, res, next) => {
  try {
    const { candidate_id, positive, negative, neutral } = req.body;

    if (isDBConnected()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(candidate_id);
      const query = isObjectId ? { candidate: candidate_id } : { candidate_id: candidate_id };
      
      const sentiment = await Sentiment.findOneAndUpdate(
        query,
        { positive, negative, neutral },
        { new: true, upsert: true }
      );
      return res.json({ success: true, data: sentiment });
    }

    const idx = dummySentiments.findIndex(s => s.candidate_id === candidate_id);
    if (idx !== -1) {
      dummySentiments[idx] = { ...dummySentiments[idx], positive, negative, neutral };
      return res.json({ success: true, data: dummySentiments[idx] });
    }
    return res.status(404).json({ success: false, error: 'Sentiment record not found' });
  } catch (err) {
    next(err);
  }
};
