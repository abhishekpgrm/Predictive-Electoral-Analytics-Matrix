const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const candidateRoutes = require('./routes/candidateRoutes');
const demographicsRoutes = require('./routes/demographicsRoutes');
const sentimentRoutes = require('./routes/sentimentRoutes');
const predictRoutes = require('./routes/predictRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true
}));
app.use(express.json());

// ── Connect Database ──
connectDB();

// ── Routes ──
app.use('/api/candidates', candidateRoutes);
app.use('/api/demographics', demographicsRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/predict', predictRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error Handler ──
app.use(errorHandler);

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n🚀 PoW Predictor API running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`📋 Candidates: http://localhost:${PORT}/api/candidates`);
  console.log(`🗳️  Predict: POST http://localhost:${PORT}/api/predict\n`);
});
