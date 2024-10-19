const db = require('../config/db');

// Get all badges
exports.getBadges = (req, res) => {
  const sql = 'SELECT * FROM badges';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

// Award a badge to a user
exports.awardBadge = (req, res) => {
  const { user_id, badge_id } = req.body;

  const sql = 'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)';
  db.query(sql, [user_id, badge_id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Badge awarded successfully!' });
  });
};
