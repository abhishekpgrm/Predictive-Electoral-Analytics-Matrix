"""
Flask API for Probability of Win (PoW) prediction.
Loads the trained Logistic Regression model and serves predictions via REST API.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ── Load model and scaler at startup ──
MODEL_PATH = 'models/pow_model.pkl'
SCALER_PATH = 'models/scaler.pkl'

model = None
scaler = None

if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✅ Model and scaler loaded successfully")
else:
    print("⚠️  Model files not found. Run: python generate_dataset.py && python train_model.py")


@app.route('/predict', methods=['POST'])
def predict():
    """Predict Probability of Win for a single candidate."""
    if model is None or scaler is None:
        return jsonify({'error': 'Model not loaded. Train the model first.'}), 503

    try:
        data = request.json

        # Validate required fields (now 8 features)
        required_fields = ['incumbency', 'party_strength', 'personal_base', 'sentiment_score',
                          'demographic_score', 'past_vote_share', 'past_work_score', 'anti_incumbency']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Prepare features array (8 features)
        features = np.array([[
            float(data['incumbency']),
            float(data['party_strength']),
            float(data['personal_base']),
            float(data['sentiment_score']),
            float(data['demographic_score']),
            float(data['past_vote_share']),
            float(data['past_work_score']),
            float(data['anti_incumbency'])
        ]])

        # Scale features and predict
        features_scaled = scaler.transform(features)
        probabilities = model.predict_proba(features_scaled)[0]

        return jsonify({
            'pow': round(float(probabilities[1]), 4),
            'win_probability': round(float(probabilities[1]) * 100, 2),
            'lose_probability': round(float(probabilities[0]) * 100, 2),
            'prediction': 'Win' if probabilities[1] > 0.5 else 'Lose',
            'confidence': round(float(max(probabilities)) * 100, 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """Predict PoW for multiple candidates at once."""
    if model is None or scaler is None:
        return jsonify({'error': 'Model not loaded'}), 503

    try:
        candidates = request.json.get('candidates', [])
        if not candidates:
            return jsonify({'error': 'No candidates provided'}), 400

        results = []

        for candidate in candidates:
            features = np.array([[
                float(candidate.get('incumbency', 0)),
                float(candidate.get('party_strength', 0.5)),
                float(candidate.get('personal_base', 0.5)),
                float(candidate.get('sentiment_score', 0.5)),
                float(candidate.get('demographic_score', 0.5)),
                float(candidate.get('past_vote_share', 0.3)),
                float(candidate.get('past_work_score', 0.3)),
                float(candidate.get('anti_incumbency', 0))
            ]])

            features_scaled = scaler.transform(features)
            probabilities = model.predict_proba(features_scaled)[0]

            results.append({
                'name': candidate.get('name', 'Unknown'),
                'pow': round(float(probabilities[1]), 4),
                'win_probability': round(float(probabilities[1]) * 100, 2)
            })

        # Sort by probability descending
        results.sort(key=lambda x: x['pow'], reverse=True)

        # Add rankings
        for i, r in enumerate(results):
            r['rank'] = i + 1

        return jsonify({'results': results})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None
    })


if __name__ == '__main__':
    print("\n🚀 PoW Predictor ML API")
    print("   POST /predict       — Single candidate prediction")
    print("   POST /batch-predict — Batch prediction")
    print("   GET  /health        — Health check\n")
    app.run(port=5001, debug=True)
