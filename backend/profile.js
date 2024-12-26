const { decodeAccessToken } = require('../login-system/token');
const db = require('../config/mysql_connection');
const mysql = require('mysql2/promise');

// Helper function to get the database connection
const getConnection = async () => {
  try {
    return await db.getConnection();
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
};

// Display user profile information
const display = async (req, res) => {
  try {
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
      console.error('Invalid or missing user information in the token');
      return res.status(401).send('Unauthorized');
    }

    const userid = decodedToken.user;
    const connection = await getConnection();

    const sqlQuery = `
      SELECT user.*, info.* 
      FROM user_table AS user 
      INNER JOIN info_table AS info 
      WHERE id = ?
    `;
    const query = mysql.format(sqlQuery, [userid]);

    const [result] = await connection.query(query);
    connection.release();

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, name, email, col_name, state, year, course } = result[0];
    res.status(200).json({ username, name, email, col_name, state, year, course });

  } catch (err) {
    console.error('Error displaying user profile:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Update user profile information
const updateProfile = async (req, res) => {
  try {
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
      console.error('Invalid or missing user information in the token');
      return res.status(401).send('Unauthorized');
    }

    const userid = decodedToken.user;
    const { name, email, col_name, state, year, course } = req.body;

    if (!userid) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const connection = await getConnection();

    const infoQuery = `
      UPDATE info_table 
      SET name = ?, email = ?, col_name = ?, state = ?, year = ?, course = ? 
      WHERE id = ?
    `;
    const infoValues = [name, email, col_name, state, year, course, userid];

    const [infoResult] = await connection.query(infoQuery, infoValues);
    connection.release();

    if (infoResult.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found in info table.' });
    }

    res.status(200).json({ message: 'User info updated successfully!' });

  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { display, updateProfile };
