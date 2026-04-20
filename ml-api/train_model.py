"""
Train a Logistic Regression model for Probability of Win (PoW) prediction.
Loads the synthetic dataset, normalizes features, trains and evaluates the model.
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import MinMaxScaler
import joblib
import os


def train_model():
    """Train and save the PoW prediction model."""

    print("=" * 50)
    print("  PoW Predictor — Model Training")
    print("=" * 50)

    # Load dataset
    print("\n📂 Loading dataset...")
    df = pd.read_csv('data/election_data.csv')
    print(f"   Total records: {len(df)}")
    print(f"   Win distribution: {df['win'].value_counts().to_dict()}")

    # Features and target
    feature_cols = ['incumbency', 'party_strength', 'personal_base', 'sentiment_score',
                    'demographic_score', 'past_vote_share', 'past_work_score', 'anti_incumbency']
    X = df[feature_cols]
    y = df['win']

    # Normalize features to 0-1 range
    print("\n🔄 Normalizing features (MinMaxScaler)...")
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)

    # Train/test split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"\n🔧 Training Logistic Regression model...")
    print(f"   Training set: {len(X_train)} samples")
    print(f"   Test set:     {len(X_test)} samples")

    # Train model
    model = LogisticRegression(
        random_state=42,
        max_iter=1000,
        C=1.0,
        solver='lbfgs'
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"\n{'=' * 50}")
    print(f"  📊 Model Performance")
    print(f"{'=' * 50}")
    print(f"\n   Accuracy: {accuracy:.2%}")
    print(f"\n{classification_report(y_test, y_pred, target_names=['Lose', 'Win'])}")

    # Feature importance
    print("📈 Feature Coefficients:")
    for name, coef in zip(feature_cols, model.coef_[0]):
        bar = '█' * int(abs(coef) * 5)
        sign = '+' if coef > 0 else ''
        print(f"   {name:22s}: {sign}{coef:.4f}  {bar}")

    # Save model and scaler
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/pow_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')

    print(f"\n✅ Model saved  → models/pow_model.pkl")
    print(f"✅ Scaler saved → models/scaler.pkl")

    # Quick prediction test
    print(f"\n{'=' * 50}")
    print("  🧪 Quick Test Prediction")
    print(f"{'=' * 50}")
    test_features = np.array([[1, 0.85, 0.75, 0.60, 0.70]])
    test_scaled = scaler.transform(test_features)
    test_prob = model.predict_proba(test_scaled)[0]
    print(f"   Input:  incumbency=1, party=0.85, sentiment=0.75, demo=0.60, votes=0.70")
    print(f"   PoW:    {test_prob[1]:.2%}")
    print(f"   Result: {'✅ Win' if test_prob[1] > 0.5 else '❌ Lose'}")


if __name__ == '__main__':
    train_model()
