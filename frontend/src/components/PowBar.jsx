const partyColors = {
  BJP: '#FF6B00',
  INC: '#0078D7',
  AAP: '#00BFA5',
  BSP: '#1A237E',
  SP: '#E53935'
};

function PowBar({ candidate, index }) {
  const rankClass = index < 3 ? `rank-${index + 1}` : '';
  const isWinner = index === 0;

  return (
    <div className="pow-bar-container" id={`pow-bar-${candidate._id || index}`}>
      <div className="pow-bar-header">
        <div className="pow-bar-candidate">
          <div className={`pow-bar-rank ${rankClass}`}>
            {index + 1}
          </div>
          <span className="pow-bar-name">{candidate.name}</span>
          <span
            className="party-badge"
            style={{
              background: partyColors[candidate.party] || '#6366f1',
              fontSize: '0.65rem',
              padding: '2px 8px'
            }}
          >
            {candidate.party}
          </span>
        </div>
        <span className="pow-bar-value" style={{ color: isWinner ? '#10b981' : 'inherit' }}>
          {candidate.win_probability?.toFixed(1) ?? (candidate.pow * 100).toFixed(1)}%
        </span>
      </div>
      <div className="pow-bar-track">
        <div
          className={`pow-bar-fill ${isWinner ? 'winner' : ''}`}
          style={{
            width: `${candidate.win_probability ?? candidate.pow * 100}%`,
            background: isWinner
              ? 'linear-gradient(90deg, #10b981, #06b6d4)'
              : `linear-gradient(90deg, ${partyColors[candidate.party] || '#6366f1'}, ${partyColors[candidate.party] || '#8b5cf6'}88)`
          }}
        ></div>
      </div>
    </div>
  );
}

export default PowBar;
