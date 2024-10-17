const { decodeAccessToken } = require('../login-system/token');
const db = require('../config/mysql_connection');
const mysql = require('mysql');
const util = require('util'); // Promisification utility for async queries

const display = async (req, res) => {
    try {
        // Decode access token
        const decodedtoken = decodeAccessToken(req.headers.authorization);

        // Validate decoded token
        if (!decodedtoken || !decodedtoken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userid = decodedtoken.user;

        // Use the connection pool and handle database query asynchronously
        const connection = await db.getConnection();
        try {
            const sqlquery = "SELECT user.*, info.* FROM user_table AS user INNER JOIN info_table AS info ON user.id = info.user_id WHERE user.id = ?";
            const query = mysql.format(sqlquery, [userid]);

            // Promisify query method for async/await usage
            const queryAsync = util.promisify(connection.query).bind(connection);
            const results = await queryAsync(query);

            // Check if user data is returned
            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Extract user details from results
            const { username, name, email, col_name, state, year, course } = results[0];

            // Return user information as JSON response
            res.status(200).json({
                username,
                name,
                email,
                col_name,
                state,
                year,
                course
            });
        } catch (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Query server error' });
        } finally {
            connection.release(); // Release connection back to the pool
        }
    } catch (err) {
        console.error('Error processing request:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { display };
