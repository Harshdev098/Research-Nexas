import pandas as pd
from preprocessing import DataPreprocessor
from models import ProfileAnalyzer, SemanticMatcher, PersonalizedRecommender
from api import app

def load_data():
    # Load your data here (this is just an example)
    papers = pd.read_csv('data/raw/papers.csv')
    profiles = pd.read_csv('data/raw/user_profiles.csv')
    return papers, profiles

def preprocess_data(papers, profiles):
    preprocessor = DataPreprocessor()
    processed_papers = preprocessor.process_papers(papers)
    processed_profiles = preprocessor.process_profiles(profiles)
    return processed_papers, processed_profiles

def initialize_models():
    profile_analyzer = ProfileAnalyzer()
    semantic_matcher = SemanticMatcher()
    recommender = PersonalizedRecommender()
    return profile_analyzer, semantic_matcher, recommender

def main():
    # Load and preprocess data
    papers, profiles = load_data()
    processed_papers, processed_profiles = preprocess_data(papers, profiles)

    # Initialize models
    profile_analyzer, semantic_matcher, recommender = initialize_models()

    # Compute embeddings for papers and profiles
    paper_embeddings = semantic_matcher.compute_embeddings(processed_papers['processed_text'])
    profile_embeddings = semantic_matcher.compute_embeddings(processed_profiles['processed_interests'])

    # Add embeddings to the dataframes
    processed_papers['embeddings'] = paper_embeddings.tolist()
    processed_profiles['embeddings'] = profile_embeddings.tolist()

    # Save processed data
    processed_papers.to_csv('data/processed/processed_papers.csv', index=False)
    processed_profiles.to_csv('data/processed/processed_profiles.csv', index=False)

    print("Data preprocessing and model initialization complete.")

    # Run the Flask app
    app.run(debug=True)

if __name__ == '__main__':
    main()