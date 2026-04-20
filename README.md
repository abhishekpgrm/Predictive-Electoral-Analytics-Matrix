# 🗳️ PoW Predictor — Predictive Electoral Analytics System

A full-stack system that predicts **Probability of Win (PoW)** for Indian election candidates using demographics, past elections, and sentiment analysis powered by Machine Learning.

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│  React Frontend │────▶│  Node.js Backend  │────▶│  Python Flask    │
│  (Vite + Charts)│     │  (Express + API)  │     │  (ML Model)      │
│  Port: 3000     │     │  Port: 5000       │     │  Port: 5001      │
└─────────────────┘     └───────┬───────────┘     └──────────────────┘
                                │
                        ┌───────▼───────────┐
                        │  MongoDB          │
                        │  (Optional)       │
                        └───────────────────┘
```

---

## 📁 Folder Structure

```
new election/
├── frontend/              # React (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Home, Dashboard, etc.)
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Root component with routing
│   │   ├── App.css        # Component/page styles
│   │   └── index.css      # Design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/               # Node.js + Express
│   ├── config/            # Database configuration
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── middleware/         # Error handling
│   ├── data/              # In-memory dummy data
│   ├── seed/              # MongoDB seeder
│   ├── server.js          # Entry point
│   └── package.json
│
├── ml-api/                # Python + Flask
│   ├── app.py             # Flask API server
│   ├── train_model.py     # Model training script
│   ├── generate_dataset.py# Dataset generator
│   ├── data/              # Training CSV data
│   ├── models/            # Saved .pkl models
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **Python** ≥ 3.8 (optional — for ML model)
- **MongoDB** (optional — app works with built-in dummy data)

### Step 1: Backend
```bash
cd backend
npm install
npm run dev        # Starts on port 5000
```

### Step 2: Frontend
```bash
cd frontend
npm install
npm run dev        # Starts on port 3000
```

### Step 3: ML API (Optional)
```bash
cd ml-api
pip install -r requirements.txt
python generate_dataset.py    # Generate training data
python train_model.py         # Train model (~85% accuracy)
python app.py                 # Starts on port 5001
```

### Step 4: Open Browser
Visit **http://localhost:3000** to use the application.

---

## 🔌 API Endpoints

| Method | Endpoint             | Description                    |
|--------|---------------------|--------------------------------|
| GET    | /api/candidates     | Fetch all candidates           |
| POST   | /api/candidates     | Add a new candidate            |
| GET    | /api/demographics   | Fetch constituency demographics|
| GET    | /api/sentiment      | Fetch sentiment data           |
| POST   | /api/sentiment      | Add sentiment entry            |
| POST   | /api/predict        | Run PoW prediction             |
| POST   | /api/predict/simulate | Scenario simulation          |
| POST   | /api/predict/turnout | Turnout scenario modeling     |
| GET    | /api/health         | Health check                   |

---

## 🧠 Feature Engineering

| Feature           | Weight | Calculation                                          |
|-------------------|--------|------------------------------------------------------|
| Incumbency        | 12%    | 1 if incumbent, 0 otherwise                         |
| Party Strength    | 18%    | Pre-mapped party strength values → [0,1]            |
| Personal Base     | 18%    | Victory margins + local influence → [0,1]           |
| Sentiment Score   | 20%    | (positive - negative + total) / (2 × total) → [0,1] |
| Demographic Score | 12%    | Party-caste alignment × constituency distribution   |
| Past Vote Share   | 10%    | Normalized against max votes in constituency → [0,1] |
| Past Work Score   | 15%    | Bills + fund utilization + projects + attendance    |
| Anti-Incumbency   | -5%    | Time in office penalty (incumbents only)            |

---

## 📊 Pages

1. **Home** — Landing page with system overview
2. **Dashboard** — Browse & select candidates by constituency
3. **Candidate Comparison** — Side-by-side table, charts
4. **Prediction Results** — PoW bars, winner card, scenario simulator

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Recharts, Axios  |
| Backend    | Node.js, Express, Mongoose       |
| Database   | MongoDB (optional)               |
| ML Model   | Python, scikit-learn, Flask       |
| Styling    | Custom CSS (Glassmorphism + Dark) |

---

## ⚡ Key Features

### Core Prediction
- ✅ ML-powered Probability of Win prediction (8-feature model)
- ✅ Personal Base vs Party Base separation
- ✅ Past Work tracking (bills, fund utilization, projects, attendance)
- ✅ Anti-incumbency scoring with time-in-office penalty
- ✅ Works without MongoDB (built-in dummy data)
- ✅ Works without Python ML API (JS fallback calculation)

### Advanced Analytics
- ✅ Strategic Gap Analysis (automated strength/weakness detection)
- ✅ Turnout Scenario Modeling (Low/Expected/High turnout)
- ✅ Multi-dimensional radar charts
- ✅ Hyper-local community analysis (Urban/Rural/Tribal)
- ✅ Interactive scenario simulator (adjust sentiment → recalculate)

### UI/UX
- ✅ Candidate comparison with enhanced metrics
- ✅ Constituency-based filtering
- ✅ Winner highlighting with rankings
- ✅ Responsive design for mobile/tablet
- ✅ Premium dark theme with glassmorphism
- ✅ Loading animations and micro-interactions

### Data Coverage
- ✅ 18 candidate fields (vs 7 originally)
- ✅ 8 ML features (vs 5 originally)
- ✅ Demographic + turnout + hyper-local data
- ✅ 100% Problem Statement 5 coverage

---

## 📝 License

MIT License — Built for educational purposes.
