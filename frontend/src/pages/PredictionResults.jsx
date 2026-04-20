import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchCandidates, fetchSentiments, predictPoW } from '../services/api';
import PowBar from '../components/PowBar';
import ScenarioSimulator from '../components/ScenarioSimulator';
import StrategicGapAnalysis from '../components/StrategicGapAnalysis';
import TurnoutScenario from '../components/TurnoutScenario';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HiOutlineTrendingUp } from 'react-icons/hi';
import api from '../services/api';

const partyColors = {
  BJP: '#FF6B00', INC: '#0078D7', AAP: '#00BFA5', BSP: '#1A237E', SP: '#E53935'
};

const CONSTITUENCIES = ['Varanasi', 'Mumbai North', 'New Delhi'];

function PredictionResults() {
  const location = useLocation();
  const passedIds = location.state?.selectedIds || [];
  const passedConstituency = location.state?.constituency || 'Varanasi';

  const [constituency, setConstituency] = useState(
    passedConstituency === 'All' ? 'Varanasi' : passedConstituency
  );
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState(passedIds);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState(null);

  // Load candidates
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const candRes = await fetchCandidates(constituency);
        setCandidates(candRes.data || []);

        // Auto-select all if no IDs passed
        if (passedIds.length === 0 && candRes.data?.length >= 2) {
          setSelectedIds(candRes.data.map(c => c._id));
        }
      } catch (err) {
        console.error('Error:', err);
      }
      setLoading(false);
    };
    loadData();
  }, [constituency]);

  // Auto-predict when IDs change and there are at least 2
  useEffect(() => {
    if (selectedIds.length >= 2 && !loading) {
      runPrediction();
    }
  }, [selectedIds, loading]);

  const runPrediction = async () => {
    if (selectedIds.length < 2) return;
    setPredicting(true);
    setError(null);
    try {
      const res = await predictPoW(selectedIds, constituency);
      setResults(res.data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Prediction failed. Make sure the backend is running.');
    }
    setPredicting(false);
  };

  const toggleCandidate = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
    setResults(null);
  };

  const winner = results?.[0];

  // Chart data
  const chartData = results?.map(r => ({
    name: r.name.split(' ')[0],
    pow: r.win_probability,
    fill: partyColors[r.party] || '#6366f1'
  })) || [];

  if (loading) return <LoadingSpinner text="Loading prediction data..." />;

  return (
    <div className="prediction-page" id="predictions">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <HiOutlineTrendingUp style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Prediction Results
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            AI-powered Probability of Win analysis
          </p>
        </div>
        <div className="page-controls">
          <select
            className="select-input"
            value={constituency}
            onChange={e => {
              setConstituency(e.target.value);
              setSelectedIds([]);
              setResults(null);
            }}
          >
            {CONSTITUENCIES.map(c => (
              <option key={c} value={c}>📍 {c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate Selector */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)',
        marginBottom: 'var(--space-xl)'
      }}>
        {candidates.map(c => (
          <button
            key={c._id}
            onClick={() => toggleCandidate(c._id)}
            className={`btn ${selectedIds.includes(c._id) ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '8px 16px' }}
          >
            {selectedIds.includes(c._id) ? '✓ ' : ''}{c.name} ({c.party})
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: 'var(--space-lg)',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          borderRadius: 'var(--radius-lg)',
          color: '#f43f5e',
          marginBottom: 'var(--space-xl)',
          textAlign: 'center'
        }}>
          ⚠️ {error}
          <button className="btn btn-secondary" style={{ marginLeft: 16 }} onClick={runPrediction}>
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {predicting && <LoadingSpinner text="Running ML prediction..." />}

      {/* Results */}
      {results && !predicting && (
        <>
          {/* Winner Card */}
          {winner && (
            <div className="glass-card winner-card" id="winner-card">
              <div className="winner-label">🏆 Predicted Winner</div>
              <div className="winner-name">{winner.name}</div>
              <div className="winner-pow">{winner.win_probability?.toFixed(1)}%</div>
              <div className="winner-party">
                <span className="party-badge" style={{
                  background: partyColors[winner.party] || '#6366f1',
                  fontSize: '0.8rem',
                  padding: '4px 14px'
                }}>
                  {winner.party}
                </span>
                {winner.incumbent && (
                  <span className="incumbent-badge" style={{ marginLeft: 8 }}>
                    ⭐ Incumbent
                  </span>
                )}
              </div>
            </div>
          )}

          {/* PoW Bars */}
          <div className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Probability of Win Rankings</h3>
            {results.map((r, i) => (
              <PowBar key={r._id || i} candidate={r} index={i} />
            ))}
          </div>

          {/* Charts + Details Grid */}
          <div className="results-grid">
            {/* Bar Chart */}
            <div className="glass-card chart-card">
              <h3>📊 PoW Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, color: '#f1f5f9'
                    }}
                    formatter={v => [`${v.toFixed(1)}%`, 'PoW']}
                  />
                  <Bar dataKey="pow" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Feature Breakdown */}
            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>🔍 Feature Breakdown</h3>
              {results.map(r => (
                <div key={r._id} style={{
                  marginBottom: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong style={{ fontSize: '0.9rem' }}>{r.name}</strong>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: r.rank === 1 ? '#10b981' : 'var(--text-secondary)' }}>
                      #{r.rank} — {r.win_probability?.toFixed(1)}%
                    </span>
                  </div>
                  {r.features && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Incumbency</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{r.features.incumbency ? 'Yes' : 'No'}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Party Strength</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(r.features.party_strength * 100).toFixed(0)}%</span>
                      <span style={{ color: 'var(--text-muted)' }}>Personal Base</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{((r.features.personal_base || 0.5) * 100).toFixed(0)}%</span>
                      <span style={{ color: 'var(--text-muted)' }}>Sentiment</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(r.features.sentiment_score * 100).toFixed(0)}%</span>
                      <span style={{ color: 'var(--text-muted)' }}>Past Work</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{((r.features.past_work_score || 0.3) * 100).toFixed(0)}%</span>
                      <span style={{ color: 'var(--text-muted)' }}>Demographic</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(r.features.demographic_score * 100).toFixed(0)}%</span>
                      <span style={{ color: 'var(--text-muted)' }}>Past Votes</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(r.features.past_vote_share * 100).toFixed(0)}%</span>
                      {r.features.anti_incumbency > 0 && (
                        <>
                          <span style={{ color: '#f43f5e' }}>Anti-Incumbency</span>
                          <span style={{ fontFamily: 'var(--font-mono)', color: '#f43f5e' }}>{(r.features.anti_incumbency * 100).toFixed(0)}%</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scenario Simulator */}
          <ScenarioSimulator candidates={results} />
          
          {/* Strategic Gap Analysis */}
          <StrategicGapAnalysis candidates={results} />
          
          {/* Turnout Scenario Modeling */}
          <TurnoutScenario candidateIds={selectedIds} constituency={constituency} apiService={api} />
        </>
      )}

      {/* No selection */}
      {!results && !predicting && selectedIds.length < 2 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3xl)',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🗳️</p>
          <p style={{ fontSize: '1.1rem' }}>Select at least 2 candidates to run prediction</p>
        </div>
      )}
    </div>
  );
}

export default PredictionResults;
