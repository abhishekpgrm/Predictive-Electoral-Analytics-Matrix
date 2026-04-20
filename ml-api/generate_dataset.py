"""
Generate synthetic Indian election dataset for training the PoW prediction model.
Creates realistic data patterns based on Indian election dynamics.
"""

import csv
import random
import os
import numpy as np


def generate_dataset(n_samples=500, output_path='data/election_data.csv'):
    """Generate synthetic election data with realistic Indian election patterns."""

    random.seed(42)
    np.random.seed(42)

    # Party base strengths (normalized 0-1)
    party_strengths = {
        'BJP': 0.82, 'INC': 0.68, 'AAP': 0.52, 'BSP': 0.42, 'SP': 0.48,
        'TMC': 0.58, 'DMK': 0.53, 'JDU': 0.44, 'RJD': 0.40, 'IND': 0.25
    }

    parties = list(party_strengths.keys())
    data = []

    for _ in range(n_samples):
        party = random.choice(parties)

        # Incumbency: ~30% of candidates are incumbents
        incumbency = random.choices([1, 0], weights=[0.3, 0.7])[0]

        # Party strength with gaussian noise
        p_strength = party_strengths[party] + np.random.normal(0, 0.08)
        p_strength = float(np.clip(p_strength, 0.05, 0.98))
        
        # Personal base (separate from party) - incumbents tend to have higher
        personal_base = np.random.beta(3, 2) if incumbency else np.random.beta(2, 2.5)
        personal_base = float(np.clip(personal_base, 0.1, 0.95))

        # Sentiment: incumbents tend to have slightly higher positive sentiment
        raw_sentiment = np.random.beta(2.5, 2.5) if incumbency else np.random.beta(2, 3)
        sentiment_score = float(np.clip(raw_sentiment, 0.02, 0.98))

        # Demographic alignment score
        demographic_score = float(np.random.beta(2, 2))

        # Past vote share correlates with party strength
        base_votes = p_strength * 0.6 + np.random.normal(0, 0.15)
        past_vote_share = float(np.clip(base_votes, 0.05, 0.95))
        
        # Past work score - higher for incumbents
        if incumbency:
            past_work_score = float(np.clip(np.random.beta(3, 2), 0.1, 0.95))
        else:
            past_work_score = float(np.clip(np.random.beta(1.5, 4), 0, 0.4))
        
        # Anti-incumbency - only for incumbents
        if incumbency:
            anti_incumbency = float(np.clip(np.random.beta(2, 3), 0.05, 0.7))
        else:
            anti_incumbency = 0.0

        # Win determination: weighted combination + noise
        win_score = (
            0.12 * incumbency +
            0.18 * p_strength +
            0.18 * personal_base +
            0.20 * sentiment_score +
            0.12 * demographic_score +
            0.10 * past_vote_share +
            0.15 * past_work_score -
            0.05 * anti_incumbency
        )

        noise = np.random.normal(0, 0.04)
        win = 1 if (win_score + noise) > 0.45 else 0

        data.append({
            'incumbency': incumbency,
            'party_strength': round(p_strength, 4),
            'personal_base': round(personal_base, 4),
            'sentiment_score': round(sentiment_score, 4),
            'demographic_score': round(demographic_score, 4),
            'past_vote_share': round(past_vote_share, 4),
            'past_work_score': round(past_work_score, 4),
            'anti_incumbency': round(anti_incumbency, 4),
            'win': win
        })

    # Create output directory
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Write CSV
    fieldnames = ['incumbency', 'party_strength', 'personal_base', 'sentiment_score',
                  'demographic_score', 'past_vote_share', 'past_work_score', 
                  'anti_incumbency', 'win']

    with open(output_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

    win_count = sum(1 for d in data if d['win'] == 1)
    print(f"✅ Dataset generated: {len(data)} records")
    print(f"📊 Win rate: {win_count / len(data):.1%}")
    print(f"💾 Saved to: {output_path}")


if __name__ == '__main__':
    generate_dataset()
