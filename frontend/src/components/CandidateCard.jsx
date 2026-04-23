import { HiCheck } from 'react-icons/hi';

const partyColors = {
  BJP: '#FF6B00',
  INC: '#0078D7',
  AAP: '#00BFA5',
  BSP: '#1A237E',
  SP: '#E53935'
};

function CandidateCard({ candidate, sentiment, selected, onToggle }) {
  const partyColor = partyColors[candidate.party] || '#6366f1';
  const total = sentiment ? (sentiment.positive + sentiment.negative + sentiment.neutral) : 100;

  const formatAssets = (value) => {
    if (value == null) return '₹0';
    if (typeof value === 'string') return value;
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };
 
  const formatVotes = (value) => {
    if (value == null) return '0';
    if (typeof value === 'string') return value;
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString('en-IN');
  };

  return (
    <div
      className={`glass-card candidate-card party-${candidate.party} ${selected ? 'selected' : ''}`}
      style={{ '--party-color': partyColor }}
      onClick={() => onToggle && onToggle(candidate._id)}
      id={`candidate-${candidate._id}`}
    >
      {/* Selection Checkbox */}
      <div className={`card-checkbox ${selected ? 'checked' : ''}`}>
        {selected && <HiCheck />}
      </div>

      {/* Header */}
      <div className="candidate-card-header">
        <div>
          <div className="candidate-name">{candidate.name}</div>
          {candidate.incumbent && (
            <span className="incumbent-badge">⭐ Incumbent</span>
          )}
        </div>
        <span className="party-badge" style={{ background: partyColor }}>
          {candidate.party}
        </span>
      </div>

      {/* Meta Info */}
      <div className="candidate-meta">
        <div className="meta-row">
          <span className="meta-label">Constituency</span>
          <span className="meta-value">{candidate.constituency}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Past Votes</span>
          <span className="meta-value">{formatVotes(candidate.past_votes)}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Assets</span>
          <span className="meta-value">{formatAssets(candidate.assets)}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Criminal Cases</span>
          <span className="meta-value" style={{ color: candidate.criminal_cases > 0 ? '#f43f5e' : '#10b981' }}>
            {candidate.criminal_cases}
          </span>
        </div>
      </div>

      {/* Sentiment Mini Bar */}
      {sentiment && (
        <div className="candidate-sentiment-mini">
          <div className="sentiment-bar-pos" style={{ width: `${(sentiment.positive / total) * 100}%` }}></div>
          <div className="sentiment-bar-neg" style={{ width: `${(sentiment.negative / total) * 100}%` }}></div>
          <div className="sentiment-bar-neu" style={{ width: `${(sentiment.neutral / total) * 100}%` }}></div>
        </div>
      )}
    </div>
  );
}

export default CandidateCard;
