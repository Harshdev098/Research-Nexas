const { decodeAccessToken } = require('../login-system/token');
const db = require('../config/mysql_connection');

const display = async (req, res) => {
    let connection;
    try {
        const decodedtoken = decodeAccessToken(req.headers.authorization);
        if (!decodedtoken || !decodedtoken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }

        const userid = decodedtoken.user;
        connection = await db.getConnection();

        const sqlquery = `
            SELECT user.*, info.* 
            FROM user_table AS user 
            LEFT JOIN info_table AS info 
            ON user.id = info.id 
            WHERE user.id = ?
        `;
        
        const [results] = await connection.promise().query(sqlquery, [userid]);

        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { username, name, email, col_name, state, year, course } = results[0];
        res.status(200).json({ username, name, email, col_name, state, year, course });
    } catch (error) {
        console.error('Error in display function:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
};

const updateProfile = async (req, res) => {
    try {
        const decodedtoken = decodeAccessToken(req.headers.authorization);
        if (!decodedtoken || !decodedtoken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }

        const userid = decodedtoken.user;
        const { name, email, col_name, state, year, course } = req.body;

        const infoQuery = `
            UPDATE info_table 
            SET name = ?, email = ?, col_name = ?, state = ?, year = ?, course = ? 
            WHERE id = ?
        `;
        const infoValues = [name, email, col_name, state, year, course, userid];

        // Wrapping the db query in a promise to enable async/await
        const result = await new Promise((resolve, reject) => {
            db.query(infoQuery, infoValues, (err, infoResult) => {
                if (err) {
                    console.error('Error updating info table:', err);
                    reject(new Error('Database error in info table update.'));
                } else {
                    resolve(infoResult);
                }
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found in info table.' });
        }

        res.status(200).json({ message: 'User info updated successfully!' });
    } catch (error) {
        console.error('Error in updateProfile function:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { display, updateProfile };