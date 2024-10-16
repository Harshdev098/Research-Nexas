const util = require('util'); // Import util module at the top
// Other imports...

const display = async (req, res) => {
    try {
        const token = decodeAccessToken(req.headers.authorization);

        // Validate the token and user information
        if (!token || !token.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = token.user;

        // Use a connection pool and promise-based query execution
        const connection = await db.getConnection();
        try {
            const sqlQuery = `
                SELECT user.*, info.*
                FROM user_table AS user
                INNER JOIN info_table AS info ON user.id = info.user_id
                WHERE user.id = ?
            `;
            const query = mysql.format(sqlQuery, [userId]);

            // Promisify the query method
            const queryAsync = util.promisify(connection.query).bind(connection);
            const results = await queryAsync(query);

            // Check if the result is not empty
            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Extract the required fields from the result
            const { username, name, email, col_name, state, year, course } = results[0];

            // Send the response in a structured way
            res.status(200).json({ 
                user: {
                    username,
                    name,
                    email,
                    col_name,
                    state,
                    year,
                    course,
                }
            });
        } catch (queryError) {
            console.error('Database query error:', queryError);
            res.status(500).json({ error: 'Query server error' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { display };
