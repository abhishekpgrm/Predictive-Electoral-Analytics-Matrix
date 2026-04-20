import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCandidates, fetchSentiments } from '../services/api';
import CandidateCard from '../components/CandidateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineUserGroup, HiOutlineLocationMarker, HiOutlineTrendingUp } from 'react-icons/hi';

const CONSTITUENCIES = ['All', 'Varanasi', 'Mumbai North', 'New Delhi'];

function Dashboard() {
  const navigate = useNavigate();
  const [constituency, setConstituency] = useState('All');
  const [candidates, setCandidates] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch candidates and sentiments
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filter = constituency === 'All' ? undefined : constituency;
        const [candRes, sentRes] = await Promise.all([
          fetchCandidates(filter),
          fetchSentiments()
        ]);
        setCandidates(candRes.data || []);
        setSentiments(sentRes.data || []);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Make sure the backend is running on port 5000.');
      }
      setLoading(false);
    };
    loadData();
  }, [constituency]);

  // Toggle candidate selection
  const toggleCandidate = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev; // max 4
      return [...prev, id];
    });
  };

  // Get sentiment for a candidate
  const getSentiment = (candidateId) => {
    return sentiments.find(s => s.candidate_id === candidateId);
  };

  // Compute stats
  const leadingParty = candidates.length > 0
    ? Object.entries(
        candidates.reduce((acc, c) => {
          acc[c.party] = (acc[c.party] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    : 'N/A';

  const avgSentiment = sentiments.length > 0
    ? Math.round(
        sentiments.reduce((sum, s) => {
          const total = s.positive + s.negative + s.neutral;
          return sum + (total > 0 ? (s.positive / total) * 100 : 50);
        }, 0) / sentiments.length
      )
    : 0;

  return (
    <div className="dashboard-page" id="dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Electoral Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Select candidates to compare and predict
          </p>
        </div>
        <div className="page-controls">
          <select
            className="select-input"
            value={constituency}
            onChange={e => { setConstituency(e.target.value); setSelectedIds([]); }}
            id="constituency-filter"
          >
            {CONSTITUENCIES.map(c => (
              <option key={c} value={c}>{c === 'All' ? '🗺️ All Constituencies' : `📍 ${c}`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="glass-card stat-mini">
          <div className="stat-mini-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)' }}>
            <HiOutlineUserGroup />
          </div>
          <div className="stat-mini-info">
            <h4>{candidates.length}</h4>
            <p>Candidates</p>
          </div>
        </div>
        <div className="glass-card stat-mini">
          <div className="stat-mini-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <HiOutlineLocationMarker />
          </div>
          <div className="stat-mini-info">
            <h4>{leadingParty}</h4>
            <p>Leading Party</p>
          </div>
        </div>
        <div className="glass-card stat-mini">
          <div className="stat-mini-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <HiOutlineTrendingUp />
          </div>
          <div className="stat-mini-info">
            <h4>{avgSentiment}%</h4>
            <p>Avg. Positive Sentiment</p>
          </div>
        </div>
      </div>

      {/* Error State */}
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
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner text="Loading candidates..." />}

      {/* Candidates Grid */}
      {!loading && !error && (
        <div className="candidates-grid">
          {candidates.map(candidate => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              sentiment={getSentiment(candidate._id)}
              selected={selectedIds.includes(candidate._id)}
              onToggle={toggleCandidate}
            />
          ))}
        </div>
      )}

      {/* No candidates */}
      {!loading && !error && candidates.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-muted)' }}>
          No candidates found for this constituency.
        </div>
      )}

      {/* Action Bar */}
      {candidates.length > 0 && (
        <div className="action-bar">
          <div className="action-bar-info">
            <strong>{selectedIds.length}</strong> of {Math.min(candidates.length, 4)} candidates selected
            {selectedIds.length < 2 && (
              <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>
                (select at least 2 to compare or predict)
              </span>
            )}
          </div>
          <div className="action-bar-buttons">
            <button
              className="btn btn-secondary"
              disabled={selectedIds.length < 2}
              onClick={() => navigate('/compare', { state: { selectedIds, constituency } })}
            >
              👥 Compare
            </button>
            <button
              className="btn btn-primary"
              disabled={selectedIds.length < 2}
              onClick={() => navigate('/predict', { state: { selectedIds, constituency } })}
            >
              🔮 Predict PoW
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
