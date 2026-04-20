import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import LoadingSpinner from './LoadingSpinner';

const partyColors = {
  BJP: '#FF6B00',
  INC: '#0078D7',
  AAP: '#00BFA5',
  BSP: '#1A237E',
  SP: '#E53935'
};

function TurnoutScenario({ candidateIds, constituency, apiService }) {
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState(null);
  const [error, setError] = useState(null);

  const runTurnoutAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.post('/predict/turnout', {
        candidate_ids: candidateIds,
        constituency
      });
      setScenarios(response.data.scenarios);
    } catch (err) {
      setError('Failed to run turnout analysis');
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner text="Analyzing turnout scenarios..." />;

  return (
    <div className="glass-card" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <h3 style={{ marginBottom: 'var(--space-xs)' }}>📈 Turnout Scenario Modeling</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Predict outcomes under different voter turnout conditions
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={runTurnoutAnalysis}
          disabled={loading}
        >
          🔄 Run Analysis
        </button>
      </div>

      {error && (
        <div style={{ padding: 'var(--space-md)', background: 'rgba(244, 63, 94, 0.1)', borderRadius: 8, marginBottom: 'var(--space-lg)' }}>
          <p style={{ color: '#f43f5e', margin: 0 }}>{error}</p>
        </div>
      )}

      {scenarios && (
        <div style={{ display: 'grid', gap: 'var(--space-xl)' }}>
          {scenarios.map((scenario, idx) => {
            const chartData = scenario.candidates.map(c => ({
              name: c.name.split(' ')[0],
              probability: c.win_probability,
              fill: partyColors[c.party] || '#6366f1'
            }));

            return (
              <div key={idx} className="glass-card" style={{ padding: 'var(--space-lg)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <h4>{scenario.scenario}</h4>
                  <span style={{
                    padding: '4px 12px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    borderRadius: 20,
                    fontSize: '0.85rem',
                    color: '#a5b4fc'
                  }}>
                    {scenario.turnout_percentage}% Turnout
                  </span>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'Win Probability (%)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 } }} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }}
                      formatter={v => [`${v}%`, 'Probability']}
                    />
                    <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Winner for this scenario */}
                <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 8 }}>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Projected Winner: </span>
                    <span style={{ color: partyColors[scenario.candidates[0].party] || '#6366f1', fontWeight: 600 }}>
                      {scenario.candidates[0].name} ({scenario.candidates[0].party})
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}> — {scenario.candidates[0].win_probability}% PoW</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!scenarios && !loading && (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
          <p>Click "Run Analysis" to model different turnout scenarios</p>
        </div>
      )}
    </div>
  );
}

export default TurnoutScenario;
