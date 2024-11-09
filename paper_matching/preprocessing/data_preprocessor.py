import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer

class DataPreprocessor:
    def __init__(self):
        nltk.download('punkt')
        nltk.download('stopwords')
        nltk.download('wordnet')
        self.stop_words = set(stopwords.words('english'))
        self.vectorizer = TfidfVectorizer(max_features=5000)

    def clean_text(self, text):
        # Tokenize and clean text
        tokens = word_tokenize(text.lower())
        tokens = [token for token in tokens if token.isalpha() and token not in self.stop_words]
        return ' '.join(tokens)

    def process_papers(self, papers_df):
        # Process research papers
        papers_df['processed_text'] = papers_df['abstract'].apply(self.clean_text)
        papers_df['processed_title'] = papers_df['title'].apply(self.clean_text)
        return papers_df

    def process_profiles(self, profiles_df):
        # Process user profiles
        profiles_df['processed_interests'] = profiles_df['interests'].apply(self.clean_text)
        profiles_df['processed_skills'] = profiles_df['skills'].apply(self.clean_text)
        return profiles_df

    def vectorize_text(self, text_series):
        return self.vectorizer.fit_transform(text_series)