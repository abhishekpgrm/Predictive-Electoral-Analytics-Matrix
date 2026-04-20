import axios from 'axios';

// Axios instance — uses Vite proxy in dev, direct URL in production
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// ── Candidates ──
export const fetchCandidates = async (constituency) => {
  const params = constituency ? { constituency } : {};
  const { data } = await api.get('/candidates', { params });
  return data;
};

export const fetchCandidate = async (id) => {
  const { data } = await api.get(`/candidates/${id}`);
  return data;
};

export const createCandidate = async (candidateData) => {
  const { data } = await api.post('/candidates', candidateData);
  return data;
};

// ── Demographics ──
export const fetchDemographics = async (constituency) => {
  const params = constituency ? { constituency } : {};
  const { data } = await api.get('/demographics', { params });
  return data;
};

// ── Sentiment ──
export const fetchSentiments = async (candidateId) => {
  const params = candidateId ? { candidate_id: candidateId } : {};
  const { data } = await api.get('/sentiment', { params });
  return data;
};

export const updateSentiment = async (sentimentData) => {
  const { data } = await api.put('/sentiment/update', sentimentData);
  return data;
};

// ── Predictions ──
export const predictPoW = async (candidateIds, constituency) => {
  const { data } = await api.post('/predict', {
    candidate_ids: candidateIds,
    constituency
  });
  return data;
};

export const simulatePoW = async (candidates) => {
  const { data } = await api.post('/predict/simulate', { candidates });
  return data;
};

// ── Health ──
export const checkHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

export default api;
