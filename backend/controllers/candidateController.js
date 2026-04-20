const Candidate = require('../models/Candidate');
const { isDBConnected } = require('../config/db');
const { candidates: dummyCandidates } = require('../data/dummyData');

// GET /api/candidates — fetch all (with optional ?constituency= filter)
exports.getAllCandidates = async (req, res, next) => {
  try {
    const { constituency } = req.query;

    if (isDBConnected()) {
      const filter = constituency ? { constituency: new RegExp(constituency, 'i') } : {};
      const candidates = await Candidate.find(filter);
      return res.json({ success: true, count: candidates.length, data: candidates });
    }

    // In-memory fallback
    let data = [...dummyCandidates];
    if (constituency) {
      data = data.filter(c =>
        c.constituency.toLowerCase() === constituency.toLowerCase()
      );
    }
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/candidates/:id — fetch single candidate
exports.getCandidate = async (req, res, next) => {
  try {
    if (isDBConnected()) {
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate) {
        return res.status(404).json({ success: false, error: 'Candidate not found' });
      }
      return res.json({ success: true, data: candidate });
    }

    const candidate = dummyCandidates.find(c => c._id === req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }
    return res.json({ success: true, data: candidate });
  } catch (err) {
    next(err);
  }
};

// POST /api/candidates — create new candidate
exports.createCandidate = async (req, res, next) => {
  try {
    const { name, party, constituency } = req.body;
    if (!name || !party || !constituency) {
      return res.status(400).json({
        success: false,
        error: 'name, party, and constituency are required'
      });
    }

    if (isDBConnected()) {
      const candidate = await Candidate.create(req.body);
      return res.status(201).json({ success: true, data: candidate });
    }

    // In-memory fallback
    const newCandidate = {
      _id: String(dummyCandidates.length + 1),
      ...req.body,
      incumbent: req.body.incumbent || false,
      past_votes: req.body.past_votes || 0,
      criminal_cases: req.body.criminal_cases || 0,
      assets: req.body.assets || 0
    };
    dummyCandidates.push(newCandidate);
    return res.status(201).json({ success: true, data: newCandidate });
  } catch (err) {
    next(err);
  }
};
