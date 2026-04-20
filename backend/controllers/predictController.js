const axios = require('axios');
const { isDBConnected } = require('../config/db');
const Candidate = require('../models/Candidate');
const Demographics = require('../models/Demographics');
const Sentiment = require('../models/Sentiment');
const {
  candidates: dummyCandidates,
  sentiments: dummySentiments,
  demographics: dummyDemographics
} = require('../data/dummyData');

const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5001';

// ── Party strength mapping ──
const partyStrengthMap = {
  'BJP': 0.85, 'INC': 0.70, 'AAP': 0.55, 'BSP': 0.45, 'SP': 0.50,
  'TMC': 0.60, 'DMK': 0.55, 'AIADMK': 0.50, 'JDU': 0.45, 'RJD': 0.40,
  'MNS': 0.35, 'IND': 0.25
};

// ── Feature Engineering Functions ──

/** Sentiment Score = (positive - negative + total) / (2 * total) → normalized 0..1 */
function calcSentimentScore(sentiment) {
  const total = sentiment.positive + sentiment.negative + sentiment.neutral;
  if (total === 0) return 0.5;
  return (sentiment.positive - sentiment.negative + total) / (2 * total);
}

/** Past Work Score - combines legislative record and fund utilization */
function calcPastWorkScore(candidate) {
  if (!candidate.past_work) return 0.3;
  
  const { bills_passed, fund_utilization, projects_completed, attendance_rate } = candidate.past_work;
  
  // Normalize each component
  const billsScore = Math.min(bills_passed / 20, 1); // 20+ bills = max
  const fundScore = fund_utilization / 100;
  const projectsScore = Math.min(projects_completed / 50, 1); // 50+ projects = max
  const attendanceScore = attendance_rate / 100;
  
  return (billsScore * 0.3 + fundScore * 0.3 + projectsScore * 0.25 + attendanceScore * 0.15);
}

/** Personal Base Score - separate from party strength */
function calcPersonalBaseScore(candidate) {
  const baseScore = candidate.personal_base_score || 0.5;
  const localInfluence = candidate.local_influence || 0.5;
  
  // Victory margin bonus
  let victoryBonus = 0;
  if (candidate.victory_margins && candidate.victory_margins.length > 0) {
    const avgMargin = candidate.victory_margins.reduce((a, b) => a + b, 0) / candidate.victory_margins.length;
    victoryBonus = Math.min(avgMargin / 150000, 0.2); // Up to 0.2 bonus for 150k+ margin
  }
  
  return Math.min((baseScore * 0.6 + localInfluence * 0.4 + victoryBonus), 1);
}

/** Anti-Incumbency Effect - reduces incumbent advantage */
function calcAntiIncumbencyEffect(candidate) {
  if (!candidate.incumbent) return 0;
  
  const baseAntiIncumbency = candidate.anti_incumbency_score || 0;
  const timeInOffice = candidate.time_in_office || 0;
  
  // Time penalty: increases with years in office
  const timePenalty = Math.min(timeInOffice / 15, 0.3); // Max 0.3 penalty at 15+ years
  
  return Math.min(baseAntiIncumbency + timePenalty, 1);
}

/** Demographic alignment score based on party-caste affinity */
function calcDemographicScore(candidate, demographics) {
  const partyDemoAlignment = {
    'BJP':  { General: 0.8, OBC: 0.6, SC: 0.4, ST: 0.3 },
    'INC':  { General: 0.5, OBC: 0.6, SC: 0.7, ST: 0.6 },
    'AAP':  { General: 0.6, OBC: 0.5, SC: 0.5, ST: 0.4 },
    'BSP':  { General: 0.3, OBC: 0.5, SC: 0.9, ST: 0.5 },
    'SP':   { General: 0.4, OBC: 0.8, SC: 0.4, ST: 0.4 }
  };

  if (!demographics || !demographics.caste_distribution) return 0.5;

  const alignment = partyDemoAlignment[candidate.party] ||
    { General: 0.5, OBC: 0.5, SC: 0.5, ST: 0.5 };

  const casteDist = demographics.caste_distribution instanceof Map
    ? Object.fromEntries(demographics.caste_distribution)
    : demographics.caste_distribution;

  let score = 0;
  let totalWeight = 0;

  for (const [caste, percentage] of Object.entries(casteDist)) {
    const weight = percentage / 100;
    score += (alignment[caste] || 0.5) * weight;
    totalWeight += weight;
  }

  // Add minority appeal bonus
  const minorityBonus = (candidate.minority_appeal || 0.5) * 0.1;
  
  return totalWeight > 0 ? Math.min((score / totalWeight) + minorityBonus, 1) : 0.5;
}

/** Normalize past votes within constituency */
function normalizePastVotes(candidateVotes, allCandidateVotes) {
  const max = Math.max(...allCandidateVotes);
  if (max === 0) return 0.5;
  return candidateVotes / max;
}

/** Calculate Strategic Gaps - identifies strengths and weaknesses */
function analyzeStrategicGaps(features, candidate) {
  const gaps = [];
  const strengths = [];
  
  // Analyze each dimension
  if (features.party_strength > 0.7) strengths.push('Strong party backing');
  else if (features.party_strength < 0.4) gaps.push('Weak party support');
  
  if (features.personal_base > 0.7) strengths.push('Strong personal loyalty');
  else if (features.personal_base < 0.4) gaps.push('Low personal appeal');
  
  if (features.past_work_score > 0.7) strengths.push('Excellent track record');
  else if (features.past_work_score < 0.3) gaps.push('Poor legislative performance');
  
  if (features.sentiment_score > 0.65) strengths.push('Positive public sentiment');
  else if (features.sentiment_score < 0.4) gaps.push('Negative public perception');
  
  if (candidate.incumbent && features.anti_incumbency > 0.4) {
    gaps.push('High anti-incumbency risk');
  }
  
  if (features.demographic_score < 0.4) gaps.push('Poor demographic alignment');
  
  return { strengths, gaps };
}

/** Enhanced JS fallback prediction with new features */
function jsPredictPoW(features) {
  const { 
    incumbency, party_strength, personal_base, sentiment_score, 
    demographic_score, past_vote_share, past_work_score, anti_incumbency 
  } = features;

  // Adjusted weights for 8 features
  const score = (
    0.12 * incumbency +
    0.18 * party_strength +
    0.18 * personal_base +
    0.20 * sentiment_score +
    0.12 * demographic_score +
    0.10 * past_vote_share +
    0.15 * past_work_score -
    0.05 * anti_incumbency // Penalty for anti-incumbency
  );

  // Sigmoid centered around 0.45
  const logit = (score - 0.45) * 10;
  const probability = 1 / (1 + Math.exp(-logit));

  return Math.round(probability * 10000) / 10000;
}

// ── POST /api/predict ──
exports.predict = async (req, res, next) => {
  try {
    const { candidate_ids, constituency } = req.body;

    if (!candidate_ids || !Array.isArray(candidate_ids) || candidate_ids.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Provide at least 2 candidate_ids in an array'
      });
    }

    // Fetch data from DB or in-memory store
    let candidates, demographics, sentiments;

    if (isDBConnected()) {
      candidates = await Candidate.find({ _id: { $in: candidate_ids } });
      const cName = constituency || candidates[0]?.constituency;
      demographics = await Demographics.findOne({ constituency: cName });
      sentiments = await Sentiment.find({ candidate: { $in: candidate_ids } });
    } else {
      candidates = dummyCandidates.filter(c => candidate_ids.includes(c._id));
      const cName = constituency || candidates[0]?.constituency;
      demographics = dummyDemographics.find(d => d.constituency === cName);
      sentiments = dummySentiments.filter(s => candidate_ids.includes(s.candidate_id));
    }

    if (candidates.length === 0) {
      return res.status(404).json({ success: false, error: 'No candidates found' });
    }

    // Calculate features and predict for each candidate
    const allPastVotes = candidates.map(c => c.past_votes);
    let predictionMethod = 'js_fallback';
    const results = [];

    for (const candidate of candidates) {
      const sentiment = sentiments.find(s =>
        s.candidate_id === (candidate._id?.toString?.() || candidate._id) ||
        (s.candidate && s.candidate.toString() === candidate._id?.toString?.())
      ) || { positive: 50, negative: 30, neutral: 20 };

      const features = {
        incumbency: candidate.incumbent ? 1 : 0,
        party_strength: partyStrengthMap[candidate.party] || 0.4,
        personal_base: calcPersonalBaseScore(candidate),
        sentiment_score: calcSentimentScore(sentiment),
        demographic_score: calcDemographicScore(candidate, demographics),
        past_vote_share: normalizePastVotes(candidate.past_votes, allPastVotes),
        past_work_score: calcPastWorkScore(candidate),
        anti_incumbency: calcAntiIncumbencyEffect(candidate)
      };

      // Try Flask ML API, fallback to JS calculation
      let pow;
      try {
        const response = await axios.post(`${FLASK_URL}/predict`, features, { timeout: 3000 });
        pow = response.data.pow;
        predictionMethod = 'ml_model';
      } catch {
        pow = jsPredictPoW(features);
      }
      
      // Strategic gap analysis
      const { strengths, gaps } = analyzeStrategicGaps(features, candidate);

      results.push({
        _id: candidate._id,
        name: candidate.name,
        party: candidate.party,
        constituency: candidate.constituency,
        incumbent: candidate.incumbent,
        past_votes: candidate.past_votes,
        criminal_cases: candidate.criminal_cases,
        assets: candidate.assets,
        personal_base_score: candidate.personal_base_score,
        past_work: candidate.past_work,
        anti_incumbency_score: candidate.anti_incumbency_score,
        time_in_office: candidate.time_in_office,
        features,
        pow,
        win_probability: Math.round(pow * 10000) / 100,
        sentiment: {
          positive: sentiment.positive,
          negative: sentiment.negative,
          neutral: sentiment.neutral
        },
        strategic_analysis: { strengths, gaps }
      });
    }

    // Sort by PoW descending and assign rankings
    results.sort((a, b) => b.pow - a.pow);
    results.forEach((r, i) => {
      r.rank = i + 1;
      r.is_winner = i === 0;
    });

    res.json({
      success: true,
      constituency: candidates[0]?.constituency,
      total_candidates: results.length,
      prediction_method: predictionMethod,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/predict/simulate ── (Scenario Simulation)
exports.simulate = async (req, res, next) => {
  try {
    const { candidates: candidateData } = req.body;

    if (!candidateData || !Array.isArray(candidateData) || candidateData.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Provide candidates array with features'
      });
    }

    const results = [];

    for (const c of candidateData) {
      const features = {
        incumbency: c.incumbency || 0,
        party_strength: c.party_strength || 0.5,
        personal_base: c.personal_base || 0.5,
        sentiment_score: c.sentiment_score || 0.5,
        demographic_score: c.demographic_score || 0.5,
        past_vote_share: c.past_vote_share || 0.3,
        past_work_score: c.past_work_score || 0.3,
        anti_incumbency: c.anti_incumbency || 0
      };

      let pow;
      try {
        const response = await axios.post(`${FLASK_URL}/predict`, features, { timeout: 3000 });
        pow = response.data.pow;
      } catch {
        pow = jsPredictPoW(features);
      }

      results.push({
        name: c.name,
        party: c.party,
        pow,
        win_probability: Math.round(pow * 10000) / 100
      });
    }

    results.sort((a, b) => b.pow - a.pow);
    results.forEach((r, i) => { r.rank = i + 1; });

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/predict/turnout ── (Turnout Scenario Modeling)
exports.turnoutScenario = async (req, res, next) => {
  try {
    const { candidate_ids, constituency, turnout_scenarios } = req.body;

    if (!candidate_ids || !Array.isArray(candidate_ids) || candidate_ids.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Provide at least 2 candidate_ids'
      });
    }

    // Default turnout scenarios: Low (50%), Medium (65%), High (80%)
    const scenarios = turnout_scenarios || [
      { name: 'Low Turnout', turnout: 50 },
      { name: 'Expected Turnout', turnout: 65 },
      { name: 'High Turnout', turnout: 80 }
    ];

    // Fetch data
    let candidates, demographics, sentiments;

    if (isDBConnected()) {
      candidates = await Candidate.find({ _id: { $in: candidate_ids } });
      const cName = constituency || candidates[0]?.constituency;
      demographics = await Demographics.findOne({ constituency: cName });
      sentiments = await Sentiment.find({ candidate: { $in: candidate_ids } });
    } else {
      candidates = dummyCandidates.filter(c => candidate_ids.includes(c._id));
      const cName = constituency || candidates[0]?.constituency;
      demographics = dummyDemographics.find(d => d.constituency === cName);
      sentiments = dummySentiments.filter(s => candidate_ids.includes(s.candidate_id));
    }

    if (candidates.length === 0) {
      return res.status(404).json({ success: false, error: 'No candidates found' });
    }

    const allPastVotes = candidates.map(c => c.past_votes);
    const scenarioResults = [];

    // Calculate for each turnout scenario
    for (const scenario of scenarios) {
      const turnoutFactor = scenario.turnout / 65; // Normalize around expected 65%
      const candidateResults = [];

      for (const candidate of candidates) {
        const sentiment = sentiments.find(s =>
          s.candidate_id === (candidate._id?.toString?.() || candidate._id) ||
          (s.candidate && s.candidate.toString() === candidate._id?.toString?.())
        ) || { positive: 50, negative: 30, neutral: 20 };

        let features = {
          incumbency: candidate.incumbent ? 1 : 0,
          party_strength: partyStrengthMap[candidate.party] || 0.4,
          personal_base: calcPersonalBaseScore(candidate),
          sentiment_score: calcSentimentScore(sentiment),
          demographic_score: calcDemographicScore(candidate, demographics),
          past_vote_share: normalizePastVotes(candidate.past_votes, allPastVotes),
          past_work_score: calcPastWorkScore(candidate),
          anti_incumbency: calcAntiIncumbencyEffect(candidate)
        };

        // Adjust features based on turnout
        // Low turnout favors party strength, high turnout favors personal base
        if (turnoutFactor < 0.9) {
          features.party_strength *= 1.1;
          features.personal_base *= 0.9;
        } else if (turnoutFactor > 1.1) {
          features.party_strength *= 0.95;
          features.personal_base *= 1.1;
        }

        // Normalize back to 0-1
        features.party_strength = Math.min(features.party_strength, 1);
        features.personal_base = Math.min(features.personal_base, 1);

        const pow = jsPredictPoW(features);

        candidateResults.push({
          _id: candidate._id,
          name: candidate.name,
          party: candidate.party,
          pow,
          win_probability: Math.round(pow * 10000) / 100
        });
      }

      candidateResults.sort((a, b) => b.pow - a.pow);
      candidateResults.forEach((r, i) => {
        r.rank = i + 1;
        r.is_winner = i === 0;
      });

      scenarioResults.push({
        scenario: scenario.name,
        turnout_percentage: scenario.turnout,
        candidates: candidateResults
      });
    }

    res.json({
      success: true,
      constituency: candidates[0]?.constituency,
      swing_voter_percentage: demographics?.swing_voter_percentage || 15,
      scenarios: scenarioResults,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};
