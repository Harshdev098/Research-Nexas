const { decodeAccessToken } = require('../login-system/token');
const db = require('../config/mysql_connection');
const mysql = require('mysql');

const display = async (req, res) => {
    try {
        // Decode the access token
        const decodedtoken = decodeAccessToken(req.headers.authorization);
        if (!decodedtoken || !decodedtoken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }
        
        const userid = decodedtoken.user;

        // Get database connection using a promise
        const connection = await db.getConnection();
        try {
            // Single line SQL query
            const sqlquery = "SELECT user.*, info.* FROM user_table AS user INNER JOIN info_table AS info ON user.id = info.user_id WHERE user.id = ?";
            const query = mysql.format(sqlquery, [userid]);

            // Execute the query using a promise-based query method
            const [results] = await connection.query(query);

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found in the database' });
            }

            // Extract user details from the query results
            const { username, name, email, col_name, state, year, course } = results[0];

            // Return the response with user data
            res.status(200).json({ username, name, email, col_name, state, year, course });

        } catch (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Query server error' });
        } finally {
            connection.release(); // Always release the connection
        }
    } catch (err) {
        console.error('Error processing request:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { display };
