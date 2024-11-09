const express = require('express');
const { getPaperRecommendations } = require('./paperMatcher');
const router = express.Router();

router.get('/recommendations', async (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in the request
    try {
        const recommendations = await getPaperRecommendations(userId);
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;