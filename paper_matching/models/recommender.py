from sklearn.ensemble import RandomForestClassifier
import numpy as np

class PersonalizedRecommender:
    def __init__(self):
        self.model = RandomForestClassifier()
        self.feedback_data = []

    def prepare_features(self, user_profile, paper):
        # Combine user and paper features
        return np.concatenate([
            user_profile['embeddings'],
            paper['embeddings']
        ])

    def train(self, training_data):
        X = []
        y = []
        
        for item in training_data:
            features = self.prepare_features(item['user'], item['paper'])
            X.append(features)
            y.append(item['rating'])
            
        self.model.fit(X, y)

    def predict(self, user_profile, papers):
        predictions = []
        
        for paper in papers:
            features = self.prepare_features(user_profile, paper)
            score = self.model.predict_proba([features])[0][1]
            predictions.append((paper, score))
            
        return sorted(predictions, key=lambda x: x[1], reverse=True)

    def update_feedback(self, user_id, paper_id, rating):
        self.feedback_data.append({
            'user_id': user_id,
            'paper_id': paper_id,
            'rating': rating
        })