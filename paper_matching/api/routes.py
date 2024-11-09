from flask import Flask, request, jsonify
from models.profile_analyzer import ProfileAnalyzer
from models.semantic_matcher import SemanticMatcher
from models.recommender import PersonalizedRecommender

app = Flask(__name__)

profile_analyzer = ProfileAnalyzer()
semantic_matcher = SemanticMatcher()
recommender = PersonalizedRecommender()

@app.route('/analyze_profile', methods=['POST'])
def analyze_profile():
    data = request.json
    profile_text = data.get('profile_text')
    
    if not profile_text:
        return jsonify({'error': 'Profile text is required'}), 400
        
    analysis = profile_analyzer.analyze_profile(profile_text)
    return jsonify(analysis)

@app.route('/match_papers', methods=['POST'])
def match_papers():
    data = request.json
    user_profile = data.get('user_profile')
    papers = data.get('papers')
    
    if not user_profile or not papers:
        return jsonify({'error': 'Both user profile and papers are required'}), 400
        
    # Get embeddings
    profile_embedding = semantic_matcher.compute_embeddings([user_profile])[0]
    paper_embeddings = semantic_matcher.compute_embeddings(papers)
    
    # Find matches
    matches, scores = semantic_matcher.find_matches(profile_embedding, paper_embeddings)
    
    return jsonify({
        'matches': [papers[i] for i in matches],
        'scores': scores.tolist()
    })

@app.route('/get_recommendations', methods=['POST'])
def get_recommendations():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
        
    recommendations = recommender.predict(
        user_profile)