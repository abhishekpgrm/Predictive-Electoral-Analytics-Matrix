import { useState } from 'react';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { simulatePoW } from '../services/api';
import PowBar from './PowBar';
import LoadingSpinner from './LoadingSpinner';

const partyStrengthMap = {
  BJP: 0.85, INC: 0.70, AAP: 0.55, BSP: 0.45, SP: 0.50
};

function ScenarioSimulator({ candidates }) {
  const [simData, setSimData] = useState(
    candidates.map(c => ({
      name: c.name,
      party: c.party,
      incumbency: c.incumbent ? 1 : 0,
      party_strength: partyStrengthMap[c.party] || 0.5,
      sentiment_score: c.features?.sentiment_score ?? 0.5,
      demographic_score: c.features?.demographic_score ?? 0.5,
      past_vote_share: c.features?.past_vote_share ?? 0.3
    }))
  );
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSliderChange = (index, field, value) => {
    setSimData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: parseFloat(value) };
      return updated;
    });
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await simulatePoW(simData);
      setResults(res.data);
    } catch (err) {
      console.error('Simulation error:', err);
      // Fallback: simple JS calculation
      const fallbackResults = simData.map(c => {
        const score = 0.20 * c.incumbency + 0.25 * c.party_strength +
          0.25 * c.sentiment_score + 0.15 * c.demographic_score +
          0.15 * c.past_vote_share;
        const logit = (score - 0.42) * 10;
        const pow = 1 / (1 + Math.exp(-logit));
        return { name: c.name, party: c.party, pow, win_probability: Math.round(pow * 10000) / 100 };
      }).sort((a, b) => b.pow - a.pow).map((r, i) => ({ ...r, rank: i + 1 }));
      setResults(fallbackResults);
    }
    setLoading(false);
  };

  return (
    <div className="simulator glass-card" id="scenario-simulator">
      <h3>
        <HiOutlineAdjustments /> Scenario Simulator
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
        Adjust sentiment and other parameters to simulate different scenarios
      </p>

      <div className="simulator-controls">
        {simData.map((candidate, idx) => (
          <div className="sim-candidate" key={idx}>
            <div className="sim-candidate-header">
              <strong>{candidate.name}</strong>
              <span className="party-badge" style={{
                background: candidate.party === 'BJP' ? '#FF6B00' :
                  candidate.party === 'INC' ? '#0078D7' :
                  candidate.party === 'AAP' ? '#00BFA5' :
                  candidate.party === 'BSP' ? '#1A237E' : '#6366f1',
                fontSize: '0.65rem', padding: '2px 8px'
              }}>
                {candidate.party}
              </span>
            </div>
            <div className="sim-sliders">
              <div className="sim-slider-row">
                <span className="sim-slider-label">Sentiment</span>
                <input
                  type="range" className="sim-slider" min="0" max="1" step="0.01"
                  value={candidate.sentiment_score}
                  onChange={e => handleSliderChange(idx, 'sentiment_score', e.target.value)}
                />
                <span className="sim-slider-value">{(candidate.sentiment_score * 100).toFixed(0)}%</span>
              </div>
              <div className="sim-slider-row">
                <span className="sim-slider-label">Party Str.</span>
                <input
                  type="range" className="sim-slider" min="0" max="1" step="0.01"
                  value={candidate.party_strength}
                  onChange={e => handleSliderChange(idx, 'party_strength', e.target.value)}
                />
                <span className="sim-slider-value">{(candidate.party_strength * 100).toFixed(0)}%</span>
              </div>
              <div className="sim-slider-row">
                <span className="sim-slider-label">Demo. Score</span>
                <input
                  type="range" className="sim-slider" min="0" max="1" step="0.01"
                  value={candidate.demographic_score}
                  onChange={e => handleSliderChange(idx, 'demographic_score', e.target.value)}
                />
                <span className="sim-slider-value">{(candidate.demographic_score * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary sim-run-btn" onClick={runSimulation} disabled={loading}>
        {loading ? '⏳ Simulating...' : '🔮 Run Simulation'}
      </button>

      {loading && <LoadingSpinner text="Running simulation..." />}

      {results && !loading && (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Simulation Results</h4>
          {results.map((r, i) => (
            <PowBar key={i} candidate={r} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScenarioSimulator;
