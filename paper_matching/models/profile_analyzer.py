import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from collections import Counter

class ProfileAnalyzer:
    def __init__(self):
        self.nlp = spacy.load('en_core_web_sm')
        self.keyword_extractor = TfidfVectorizer(max_features=100)

    def extract_keywords(self, text):
        doc = self.nlp(text)
        keywords = []
        
        # Extract named entities
        for ent in doc.ents:
            keywords.append(ent.text)
            
        # Extract noun phrases
        for chunk in doc.noun_chunks:
            keywords.append(chunk.text)
            
        return list(set(keywords))

    def extract_skills(self, text):
        doc = self.nlp(text)
        skills = []
        
        # Custom skill extraction logic
        for token in doc:
            if token.pos_ in ['NOUN', 'PROPN']:
                skills.append(token.text)
                
        return list(set(skills))

    def analyze_profile(self, profile_text):
        return {
            'keywords': self.extract_keywords(profile_text),
            'skills': self.extract_skills(profile_text),
            'interests': self.extract_keywords(profile_text)  # Can be refined further
        }