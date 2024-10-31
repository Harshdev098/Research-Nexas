from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class SemanticMatcher:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def compute_embeddings(self, texts):
        return self.model.encode(texts)

    def compute_similarity(self, embedding1, embedding2):
        return cosine_similarity(
            embedding1.reshape(1, -1),
            embedding2.reshape(1, -1)
        )[0][0]

    def find_matches(self, query_embedding, candidate_embeddings, top_k=5):
        similarities = cosine_similarity(
            query_embedding.reshape(1, -1),
            candidate_embeddings
        )[0]
        
        top_indices = np.argsort(similarities)[::-1][:top_k]
        return top_indices, similarities[top_indices]