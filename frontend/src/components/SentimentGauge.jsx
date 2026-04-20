function SentimentGauge({ sentiment }) {
  if (!sentiment) return null;

  const total = sentiment.positive + sentiment.negative + sentiment.neutral;
  if (total === 0) return null;

  const posPercent = Math.round((sentiment.positive / total) * 100);
  const negPercent = Math.round((sentiment.negative / total) * 100);
  const neuPercent = Math.round((sentiment.neutral / total) * 100);

  return (
    <div className="sentiment-gauge">
      <div className="sentiment-bar-group">
        <div className="sentiment-row">
          <span className="sentiment-label">Positive</span>
          <div className="sentiment-track">
            <div className="sentiment-fill positive" style={{ width: `${posPercent}%` }}></div>
          </div>
          <span className="sentiment-value" style={{ color: '#10b981' }}>{posPercent}%</span>
        </div>
        <div className="sentiment-row">
          <span className="sentiment-label">Negative</span>
          <div className="sentiment-track">
            <div className="sentiment-fill negative" style={{ width: `${negPercent}%` }}></div>
          </div>
          <span className="sentiment-value" style={{ color: '#f43f5e' }}>{negPercent}%</span>
        </div>
        <div className="sentiment-row">
          <span className="sentiment-label">Neutral</span>
          <div className="sentiment-track">
            <div className="sentiment-fill neutral" style={{ width: `${neuPercent}%` }}></div>
          </div>
          <span className="sentiment-value" style={{ color: '#94a3b8' }}>{neuPercent}%</span>
        </div>
      </div>
    </div>
  );
}

export default SentimentGauge;
