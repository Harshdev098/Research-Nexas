const express = require('express');
const router = express.Router();
const db = require('../db');  // Assuming db.js has your MySQL config

// Get all badges for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT badges.name, badges.description, user_badges.earned_at 
    FROM badges
    JOIN user_badges ON badges.id = user_badges.badge_id
    WHERE user_badges.user_id = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Award a new badge to a user
router.post('/award', (req, res) => {
  const { userId, badgeId } = req.body;
  const sql = `INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)`;

  db.query(sql, [userId, badgeId], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Badge awarded successfully' });
  });
});

module.exports = router;
