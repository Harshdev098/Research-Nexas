import re
import json
import numpy as np
from datetime import datetime
from typing import List, Dict, Union, Any
import logging
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DataValidator:
    """Validates data formats and contents"""
    
    @staticmethod
    def validate_paper(paper: Dict[str, Any]) -> bool:
        """
        Validates paper data structure
        """
        required_fields = ['paper_id', 'title', 'abstract', 'authors', 'keywords']
        return all(field in paper for field in required_fields)

    @staticmethod
    def validate_profile(profile: Dict[str, Any]) -> bool:
        """
        Validates user profile data structure
        """
        required_fields = ['user_id', 'interests', 'skills']
        return all(field in profile for field in required_fields)

class TextProcessor:
    """Text processing utilities"""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean and normalize text
        """
        if not isinstance(text, str):
            return ""
            
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters
        text = re.sub(r'[^\w\s]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text

    @staticmethod
    def extract_keywords(text: str) -> List[str]:
        """
        Extract keywords from text
        """
        # Simple keyword extraction (can be enhanced with NLP techniques)
        words = text.split()
        # Remove common words (you might want to use a proper stop words list)
        common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to'}
        keywords = [word for word in words if word not in common_words]
        return keywords

class SimilarityCalculator:
    """Calculate similarities between vectors"""
    
    @staticmethod
    def cosine_similarity_score(vec1: np.ndarray, vec2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two vectors
        """
        if vec1.size == 0 or vec2.size == 0:
            return 0.0
        return float(cosine_similarity(vec1.reshape(1, -1), vec2.reshape(1, -1))[0][0])

    @staticmethod
    def calculate_overlap_score(set1: set, set2: set) -> float:
        """
        Calculate Jaccard similarity between two sets
        """
        if not set1 or not set2:
            return 0.0
        return len(set1.intersection(set2)) / len(set1.union(set2))

class FileHandler:
    """Handle file operations"""
    
    @staticmethod
    def save_to_json(data: Union[List, Dict], filepath: str) -> None:
        """
        Save data to JSON file
        """
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
            logger.info(f"Successfully saved data to {filepath}")
        except Exception as e:
            logger.error(f"Error saving to JSON: {str(e)}")
            raise

    @staticmethod
    def load_from_json(filepath: str) -> Union[List, Dict]:
        """
        Load data from JSON file
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            logger.info(f"Successfully loaded data from {filepath}")
            return data
        except Exception as e:
            logger.error(f"Error loading JSON: {str(e)}")
            raise

class ResultsManager:
    """Manage and format matching results"""
    
    @staticmethod
    def format_match_results(matches: List[Dict], scores: List[float]) -> List[Dict]:
        """
        Format matching results with scores
        """
        return [
            {
                'paper': match,
                'score': float(score),
                'timestamp': datetime.now().isoformat()
            }
            for match, score in zip(matches, scores)
        ]

    @staticmethod
    def filter_results(results: List[Dict], threshold: float = 0.5) -> List[Dict]:
        """
        Filter results based on similarity threshold
        """
        return [result for result in results if result['score'] >= threshold]

class PerformanceMetrics:
    """Calculate and track system performance metrics"""
    
    @staticmethod
    def calculate_precision_at_k(relevant_items: set, recommended_items: List, k: int) -> float:
        """
        Calculate precision@k for recommendations
        """
        if not recommended_items or k <= 0:
            return 0.0
            
        recommended_k = set(recommended_items[:k])
        relevant_and_recommended = relevant_items.intersection(recommended_k)
        
        return len(relevant_and_recommended) / k

    @staticmethod
    def calculate_recall_at_k(relevant_items: set, recommended_items: List, k: int) -> float:
        """
        Calculate recall@k for recommendations
        """
        if not relevant_items or not recommended_items or k <= 0:
            return 0.0
            
        recommended_k = set(recommended_items[:k])
        relevant_and_recommended = relevant_items.intersection(recommended_k)
        
        return len(relevant_and_recommended) / len(relevant_items)

class DataExporter:
    """Export data in various formats"""
    
    @staticmethod
    def export_to_csv(data: List[Dict], filepath: str) -> None:
        """
        Export results to CSV
        """
        try:
            df = pd.DataFrame(data)
            df.to_csv(filepath, index=False)
            logger.info(f"Successfully exported data to {filepath}")
        except Exception as e:
            logger.error(f"Error exporting to CSV: {str(e)}")
            raise

    @staticmethod
    def export_to_excel(data: List[Dict], filepath: str) -> None:
        """
        Export results to Excel
        """
        try:
            df = pd.DataFrame(data)
            df.to_excel(filepath, index=False)
            logger.info(f"Successfully exported data to {filepath}")
        except Exception as e:
            logger.error(f"Error exporting to Excel: {str(e)}")
            raise

def create_directory_if_not_exists(directory: str) -> None:
    """
    Create directory if it doesn't exist
    """
    Path(directory).mkdir(parents=True, exist_ok=True)

def get_file_extension(filename: str) -> str:
    """
    Get file extension from filename
    """
    return Path(filename).suffix.lower()

def is_valid_file_type(filename: str, allowed_extensions: set) -> bool:
    """
    Check if file type is allowed
    """
    return get_file_extension(filename) in allowed_extensions

# Example usage:
if __name__ == "__main__":
    # Test text processing
    text_processor = TextProcessor()
    cleaned_text = text_processor.clean_text("This is a TEST string!!!")
    print(f"Cleaned text: {cleaned_text}")
    
    # Test similarity calculation
    calc = SimilarityCalculator()
    vec1 = np.array([1, 2, 3])
    vec2 = np.array([2, 4, 6])
    similarity = calc.cosine_similarity_score(vec1, vec2)
    print(f"Similarity score: {similarity}")
    
    # Test data validation
    DataValidator