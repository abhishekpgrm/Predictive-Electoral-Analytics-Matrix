import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

const partyColors = {
  BJP: '#FF6B00',
  INC: '#0078D7',
  AAP: '#00BFA5',
  BSP: '#1A237E',
  SP: '#E53935'
};

function StrategicGapAnalysis({ candidates }) {
  if (!candidates || candidates.length === 0) return null;

  // Transform features into radar chart data
  const radarData = [
    { metric: 'Party Strength', ...candidates.reduce((acc, c, i) => ({ ...acc, [c.name]: (c.features?.party_strength || 0.5) * 100 }), {}) },
    { metric: 'Personal Base', ...candidates.reduce((acc, c, i) => ({ ...acc, [c.name]: (c.features?.personal_base || 0.5) * 100 }), {}) },
    { metric: 'Sentiment', ...candidates.reduce((acc, c, i) => ({ ...acc, [c.name]: (c.features?.sentiment_score || 0.5) * 100 }), {}) },
    { metric: 'Past Work', ...candidates.reduce((acc, c, i) => ({ ...acc, [c.name]: (c.features?.past_work_score || 0.3) * 100 }), {}) },
    { metric: 'Demographics', ...candidates.reduce((acc, c, i) => ({ ...acc, [c.name]: (c.features?.demographic_score || 0.5) * 100 }), {}) },
    { metric: 'Vote Share', ...candidates.reduce((acc, c, i) => ({ ...acc, [c.name]: (c.features?.past_vote_share || 0.3) * 100 }), {}) }
  ];

  return (
    <div className="glass-card" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-xl)' }}>
      <h3 style={{ marginBottom: 'var(--space-md)' }}>📊 Strategic Gap Analysis</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
        Multi-dimensional comparison across key electoral factors
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" fontSize={10} />
          {candidates.map((c, i) => (
            <Radar
              key={c._id}
              name={c.name}
              dataKey={c.name}
              stroke={partyColors[c.party] || '#6366f1'}
              fill={partyColors[c.party] || '#6366f1'}
              fillOpacity={0.3}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>

      {/* Strategic Insights */}
      <div style={{ marginTop: 'var(--space-xl)', display: 'grid', gap: 'var(--space-md)' }}>
        {candidates.map(c => (
          <div key={c._id} className="glass-card" style={{ padding: 'var(--space-md)', background: 'rgba(0,0,0,0.2)' }}>
            <h4 style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: partyColors[c.party] || '#6366f1', display: 'inline-block'
              }}></span>
              {c.name} ({c.party})
            </h4>
            
            {c.strategic_analysis && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                {/* Strengths */}
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginBottom: 4 }}>✅ STRENGTHS</p>
                  {c.strategic_analysis.strengths?.length > 0 ? (
                    <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: 20, margin: 0 }}>
                      {c.strategic_analysis.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No major strengths identified</p>
                  )}
                </div>

                {/* Gaps */}
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600, marginBottom: 4 }}>⚠️ STRATEGIC GAPS</p>
                  {c.strategic_analysis.gaps?.length > 0 ? (
                    <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: 20, margin: 0 }}>
                      {c.strategic_analysis.gaps.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No major gaps identified</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StrategicGapAnalysis;
