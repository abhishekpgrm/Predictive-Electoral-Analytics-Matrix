import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCandidates, fetchSentiments } from '../services/api';
import ComparisonTable from '../components/ComparisonTable';
import SentimentGauge from '../components/SentimentGauge';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const partyColors = {
  BJP: '#FF6B00', INC: '#0078D7', AAP: '#00BFA5', BSP: '#1A237E', SP: '#E53935'
};

const CONSTITUENCIES = ['Varanasi', 'Mumbai North', 'New Delhi'];

function CandidateComparison() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedIds = location.state?.selectedIds || [];
  const passedConstituency = location.state?.constituency || 'Varanasi';

  const [constituency, setConstituency] = useState(passedConstituency === 'All' ? 'Varanasi' : passedConstituency);
  const [candidates, setCandidates] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [selectedIds, setSelectedIds] = useState(passedIds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [candRes, sentRes] = await Promise.all([
          fetchCandidates(constituency),
          fetchSentiments()
        ]);
        setCandidates(candRes.data || []);
        setSentiments(sentRes.data || []);

        // If no passed IDs, auto-select first 2-3 candidates
        if (passedIds.length === 0 && candRes.data?.length >= 2) {
          setSelectedIds(candRes.data.slice(0, 3).map(c => c._id));
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
      setLoading(false);
    };
    loadData();
  }, [constituency]);

  const selectedCandidates = candidates.filter(c => selectedIds.includes(c._id));

  const toggleCandidate = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  // ── Chart Data ──
  const votesChartData = selectedCandidates.map(c => ({
    name: c.name.split(' ')[0],
    votes: c.past_votes,
    fill: partyColors[c.party] || '#6366f1'
  }));

  const sentimentPieData = selectedCandidates.map(c => {
    const s = sentiments.find(s => s.candidate_id === c._id) || { positive: 50, negative: 30, neutral: 20 };
    return { name: c.name.split(' ')[0], positive: s.positive, negative: s.negative, neutral: s.neutral };
  });

  const SENTIMENT_COLORS = ['#10b981', '#f43f5e', '#64748b'];

  if (loading) return <LoadingSpinner text="Loading comparison data..." />;

  return (
    <div className="comparison-page" id="comparison">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Candidate Comparison</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Side-by-side analysis of selected candidates
          </p>
        </div>
        <div className="page-controls">
          <select
            className="select-input"
            value={constituency}
            onChange={e => { setConstituency(e.target.value); setSelectedIds([]); }}
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

      {/* Comparison Table */}
      {selectedCandidates.length >= 2 ? (
        <>
          <ComparisonTable candidates={selectedCandidates} sentiments={sentiments} />

          {/* Sentiment Gauges */}
          <div style={{ marginTop: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Sentiment Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
              {selectedCandidates.map(c => {
                const s = sentiments.find(s => s.candidate_id === c._id) || { positive: 50, negative: 30, neutral: 20 };
                return (
                  <div key={c._id} className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                    <h4 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: partyColors[c.party] || '#6366f1', display: 'inline-block'
                      }}></span>
                      {c.name}
                    </h4>
                    <SentimentGauge sentiment={s} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts */}
          <div className="charts-section">
            {/* Bar Chart — Past Votes */}
            <div className="glass-card chart-card">
              <h3>📊 Past Vote Share</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={votesChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => v >= 100000 ? `${(v/100000).toFixed(0)}L` : `${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }}
                    formatter={v => [v.toLocaleString('en-IN'), 'Votes']}
                  />
                  <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                    {votesChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart — First candidate's sentiment */}
            <div className="glass-card chart-card">
              <h3>🥧 Sentiment Distribution</h3>
              {sentimentPieData.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Positive', value: sentimentPieData[0].positive },
                        { name: 'Negative', value: sentimentPieData[0].negative },
                        { name: 'Neutral', value: sentimentPieData[0].neutral }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {SENTIMENT_COLORS.map((color, i) => (
                        <Cell key={i} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>
                Showing: {sentimentPieData[0]?.name || 'N/A'}
              </p>
            </div>
          </div>

          {/* Predict Button */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <button
              className="btn btn-primary"
              style={{ padding: '14px 40px', fontSize: '1rem' }}
              onClick={() => navigate('/predict', { state: { selectedIds, constituency } })}
            >
              🔮 Run Prediction for Selected Candidates
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>Select at least 2 candidates to compare</p>
        </div>
      )}
    </div>
  );
}

export default CandidateComparison;
