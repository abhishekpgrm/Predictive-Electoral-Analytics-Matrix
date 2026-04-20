import { Link } from 'react-router-dom';
import { HiOutlineLightningBolt, HiOutlineChartPie, HiOutlineUserGroup, HiOutlineTrendingUp } from 'react-icons/hi';

function Home() {
  return (
    <div className="home-page">
      {/* ── Hero Section ── */}
      <section className="hero" id="hero">
        <div className="hero-badge">
          <span>🤖</span> AI-Powered Electoral Intelligence
        </div>

        <h1>
          Predict the <span className="gradient-text">Next Winner</span> with Data
        </h1>

        <p className="hero-subtitle">
          Advanced machine learning meets Indian electoral dynamics. Analyze demographics,
          sentiment, and historical data to predict Probability of Win for any candidate.
        </p>

        <Link to="/dashboard" className="hero-cta">
          Launch Dashboard <HiOutlineLightningBolt />
        </Link>
      </section>

      {/* ── Features Section ── */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Powered by <span className="gradient-text">Intelligence</span></h2>
          <p>Multi-dimensional analysis for accurate election predictions</p>
        </div>

        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon indigo">
              <HiOutlineLightningBolt />
            </div>
            <h3>ML Predictions</h3>
            <p>
              Logistic Regression model trained on electoral features to calculate
              Probability of Win with high accuracy.
            </p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon cyan">
              <HiOutlineChartPie />
            </div>
            <h3>Sentiment Analysis</h3>
            <p>
              Gauge public opinion through positive, negative, and neutral sentiment
              scores for each candidate.
            </p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon amber">
              <HiOutlineUserGroup />
            </div>
            <h3>Demographic Insights</h3>
            <p>
              Factor in caste and religion distributions to understand constituency-level
              dynamics and voting patterns.
            </p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon emerald">
              <HiOutlineTrendingUp />
            </div>
            <h3>Scenario Simulation</h3>
            <p>
              Adjust variables like sentiment and party strength to simulate
              &quot;what-if&quot; scenarios and see how outcomes shift.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="stats-section" id="stats">
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-value gradient-text">3+</div>
            <div className="stat-label">Constituencies Analyzed</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-value gradient-text-secondary">11+</div>
            <div className="stat-label">Candidates Tracked</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-value" style={{
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>85%+</div>
            <div className="stat-label">Prediction Accuracy</div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{
        textAlign: 'center',
        padding: 'var(--space-3xl) var(--space-xl)',
        marginBottom: 'var(--space-2xl)'
      }}>
        <h2 style={{ marginBottom: 'var(--space-md)' }}>
          Ready to <span className="gradient-text">Explore</span>?
        </h2>
        <p style={{ marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
          Dive into the dashboard to compare candidates, run predictions,
          and simulate scenarios across Indian constituencies.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary">
            📊 Open Dashboard
          </Link>
          <Link to="/compare" className="btn btn-secondary">
            👥 Compare Candidates
          </Link>
          <Link to="/predict" className="btn btn-secondary">
            🔮 Run Predictions
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
