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

// Display evaluation criteria for the stock holder
const stk_display = async (req, res) => {
  try {
    // Decode the access token to get the user ID
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
      console.error('Invalid or missing user information in the token');
      return res.status(401).send('Unauthorized');
    }

    const userid = decodedToken.user;
    const connection = await getConnection();

    // Query to get the stock holder's information
    const sqlQuery = "SELECT * FROM stk_holder WHERE id = ?";
    const [stkHolderResult] = await connection.query(sqlQuery, [userid]);
    
    if (stkHolderResult.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Stock holder not found' });
    }

    const { col_name, email } = stkHolderResult[0];

    // Query to get the evaluation criteria based on the college
    const criteriaQuery = "SELECT * FROM criteria WHERE college = ?";
    const [criteriaResult] = await connection.query(criteriaQuery, [col_name]);

    if (criteriaResult.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Criteria not found for the college' });
    }

    const { level1, level2, level3, level4 } = criteriaResult[0];
    connection.release();

    // Return the evaluation criteria along with the college and email
    res.json({ credit1: level1, credit2: level2, credit3: level3, credit4: level4, col_name, email });

  } catch (err) {
    console.error('Error fetching stock holder details:', err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { stk_display };
