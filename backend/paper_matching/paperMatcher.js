const natural = require('natural');
const db = require('../config/mysql_connection');

// Function to preprocess text
const preprocessText = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
};

// Function to calculate similarity between two texts
const calculateSimilarity = (text1, text2) => {
    const tokenizer = new natural.WordTokenizer();
    const words1 = tokenizer.tokenize(preprocessText(text1));
    const words2 = tokenizer.tokenize(preprocessText(text2));
    const tfidf = new natural.TfIdf();
    
    tfidf.addDocument(words1);
    tfidf.addDocument(words2);
    
    return tfidf.tfidfs[0][1]; // Similarity score between documents
};

// Function to get paper recommendations for a user
const getPaperRecommendations = async (userId) => {
    try {
        const userQuery = `SELECT interests FROM info_table WHERE id=?`;
        const userProfile = await db.query(userQuery, [userId]);
        const userInterests = userProfile[0].interests;

        const papersQuery = `SELECT * FROM upload_file_db`;
        const papers = await db.query(papersQuery);
        
        const recommendations = papers.map(paper => {
            const similarity = calculateSimilarity(userInterests, paper.filename); // Assuming filename contains relevant information
            return { paper, similarity };
        });

        // Sort papers based on similarity score
        recommendations.sort((a, b) => b.similarity - a.similarity);
        
        return recommendations.slice(0, 5); // Return top 5 recommendations
    } catch (error) {
        console.error("Error fetching paper recommendations:", error);
        throw error;
    }
};

module.exports = { getPaperRecommendations };