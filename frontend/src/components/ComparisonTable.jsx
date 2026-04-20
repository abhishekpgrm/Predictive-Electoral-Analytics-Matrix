const partyColors = {
  BJP: '#FF6B00',
  INC: '#0078D7',
  AAP: '#00BFA5',
  BSP: '#1A237E',
  SP: '#E53935'
};

function ComparisonTable({ candidates, sentiments }) {
  const formatAssets = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const formatVotes = (value) => {
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString('en-IN');
  };

  const getSentiment = (candidateId) => {
    return sentiments?.find(s => s.candidate_id === candidateId) ||
      { positive: 0, negative: 0, neutral: 0 };
  };

  if (!candidates || candidates.length === 0) {
    return <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Select candidates to compare</p>;
  }

  return (
    <div className="comparison-table-wrapper">
      <table className="comparison-table" id="comparison-table">
        <thead>
          <tr>
            <th>Attribute</th>
            {candidates.map(c => (
              <th key={c._id}>
                <span style={{ color: partyColors[c.party] || '#6366f1' }}>{c.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Party</td>
            {candidates.map(c => (
              <td key={c._id}>
                <span className="party-badge" style={{
                  background: partyColors[c.party] || '#6366f1',
                  fontSize: '0.7rem'
                }}>
                  {c.party}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td>Constituency</td>
            {candidates.map(c => <td key={c._id}>{c.constituency}</td>)}
          </tr>
          <tr>
            <td>Incumbent</td>
            {candidates.map(c => (
              <td key={c._id} style={{ color: c.incumbent ? '#f59e0b' : '#64748b' }}>
                {c.incumbent ? '✅ Yes' : '❌ No'}
              </td>
            ))}
          </tr>
          <tr>
            <td>Personal Base Score</td>
            {candidates.map(c => (
              <td key={c._id} style={{ fontWeight: 600, color: c.personal_base_score > 0.6 ? '#10b981' : '#94a3b8' }}>
                {((c.personal_base_score || 0.5) * 100).toFixed(0)}%
              </td>
            ))}
          </tr>
          <tr>
            <td>Past Votes</td>
            {candidates.map(c => (
              <td key={c._id} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {formatVotes(c.past_votes)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Past Work Score</td>
            {candidates.map(c => {
              const pw = c.past_work || {};
              const score = pw.bills_passed || pw.fund_utilization || pw.projects_completed ? 
                ((pw.bills_passed || 0) * 5 + (pw.fund_utilization || 0) + (pw.projects_completed || 0) * 2) / 3 : 0;
              return (
                <td key={c._id} style={{ color: score > 60 ? '#10b981' : score > 30 ? '#f59e0b' : '#64748b' }}>
                  {score > 0 ? `${score.toFixed(0)}%` : 'N/A'}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>Legislative Bills</td>
            {candidates.map(c => (
              <td key={c._id}>{c.past_work?.bills_passed || 0}</td>
            ))}
          </tr>
          <tr>
            <td>Fund Utilization</td>
            {candidates.map(c => (
              <td key={c._id} style={{ color: (c.past_work?.fund_utilization || 0) > 70 ? '#10b981' : '#94a3b8' }}>
                {c.past_work?.fund_utilization || 0}%
              </td>
            ))}
          </tr>
          <tr>
            <td>Projects Completed</td>
            {candidates.map(c => (
              <td key={c._id}>{c.past_work?.projects_completed || 0}</td>
            ))}
          </tr>
          <tr>
            <td>Anti-Incumbency Risk</td>
            {candidates.map(c => (
              <td key={c._id} style={{ color: (c.anti_incumbency_score || 0) > 0.4 ? '#f43f5e' : '#10b981' }}>
                {c.incumbent ? `${((c.anti_incumbency_score || 0) * 100).toFixed(0)}%` : 'N/A'}
              </td>
            ))}
          </tr>
          <tr>
            <td>Assets</td>
            {candidates.map(c => <td key={c._id}>{formatAssets(c.assets)}</td>)}
          </tr>
          <tr>
            <td>Criminal Cases</td>
            {candidates.map(c => (
              <td key={c._id} style={{ color: c.criminal_cases > 0 ? '#f43f5e' : '#10b981' }}>
                {c.criminal_cases}
              </td>
            ))}
          </tr>
          <tr>
            <td>Community Type</td>
            {candidates.map(c => (
              <td key={c._id}>{c.community_type || 'Mixed'}</td>
            ))}
          </tr>
          <tr>
            <td>Positive Sentiment</td>
            {candidates.map(c => {
              const s = getSentiment(c._id);
              return <td key={c._id} style={{ color: '#10b981' }}>{s.positive}%</td>;
            })}
          </tr>
          <tr>
            <td>Negative Sentiment</td>
            {candidates.map(c => {
              const s = getSentiment(c._id);
              return <td key={c._id} style={{ color: '#f43f5e' }}>{s.negative}%</td>;
            })}
          </tr>
          <tr>
            <td>Neutral Sentiment</td>
            {candidates.map(c => {
              const s = getSentiment(c._id);
              return <td key={c._id} style={{ color: '#94a3b8' }}>{s.neutral}%</td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;
