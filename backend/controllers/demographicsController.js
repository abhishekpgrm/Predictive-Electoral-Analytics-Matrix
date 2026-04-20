const Demographics = require('../models/Demographics');
const { isDBConnected } = require('../config/db');
const { demographics: dummyDemographics } = require('../data/dummyData');

// GET /api/demographics — fetch demographics (with optional ?constituency= filter)
exports.getDemographics = async (req, res, next) => {
  try {
    const { constituency } = req.query;

    if (isDBConnected()) {
      const filter = constituency ? { constituency: new RegExp(constituency, 'i') } : {};
      const demographics = await Demographics.find(filter);
      return res.json({ success: true, data: demographics });
    }

    // In-memory fallback
    let data = [...dummyDemographics];
    if (constituency) {
      data = data.filter(d =>
        d.constituency.toLowerCase() === constituency.toLowerCase()
      );
    }
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
