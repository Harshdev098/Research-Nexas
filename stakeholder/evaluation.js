const mysql = require('mysql2/promise'); // Use promise-based MySQL
const { decodeAccessToken } = require('../login-system/token');
require("dotenv").config();
const db = require('../config/mysql_connection'); // Ensure it's using a promise-based connection pool

// Set criteria for evaluation
const setcriteria = async (req, res) => {
    const { value1, value2, value3, value4, topicval, value5 } = req.body;
    const topicValue = topicval && topicval.trim() !== '' ? topicval : null;
    const safeValue5 = value5 ?? null;

    try {
        const decodedToken = await decodeAccessToken(req.headers.authorization);
        if (!decodedToken || !decodedToken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }

        const id = decodedToken.user;
        const connection = await db.getConnection();
        // Check if the stakeholder exists
        const [result] = await connection.execute('SELECT * FROM stk_holder WHERE id = ?', [id]);
        const col_name = result[0]?.col_name;
        if (!col_name) {
            connection.release();
            return res.status(404).send('User not found');
        }
        const [existingCriteria] = await connection.execute('SELECT * FROM criteria WHERE college = ?', [col_name]);
        if (existingCriteria.length > 0) {
            connection.release();
            console.log('Criteria already present');
            return res.status(401).send('Criteria already set');
        }
        const insertQuery = 'INSERT INTO criteria VALUES(?,?,?,?,?,?,?,?)';
        await connection.execute(insertQuery, [id, col_name, value1, value2, value3, value4, topicValue, safeValue5]);

        console.log('Evaluation criteria set');
        res.status(200).send('Criteria successfully set');
        connection.release();
    } catch (err) {
        console.error('Error during setcriteria:', err);
        res.status(500).send('Internal Server Error');
    }
};


// Evaluate the result of the student
const evaluate = async (req, res) => {
    try {
        console.log("evaluation started")
        const decodedToken = await decodeAccessToken(req.headers.authorization);
        if (!decodedToken || !decodedToken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }

        const userid = decodedToken.user;
        const connection = await db.getConnection();

        // Fetch college name for the student
        const [result] = await connection.execute('SELECT * FROM info_table WHERE id = ?', [userid]);
        const stu_col_name = result[0]?.col_name;
        if (!stu_col_name) {
            connection.release();
            console.log("student not found")
            return res.status(404).send('Student not found');
        }

        // Fetch criteria for the student's college
        const [criteria] = await connection.execute('SELECT * FROM criteria WHERE college = ?', [stu_col_name]);
        if (criteria.length === 0) {
            connection.release();
            console.log("criteria not found")
            return res.status(404).send('Criteria not found for the college');
        }

        // Fetch student's ratings
        const [ratings] = await connection.execute('SELECT * FROM result WHERE userid = ?', [userid]);
        if (ratings.length === 0) {
            connection.release();
            console.log("result not found")
            return res.status(404).send('Student result not found');
        }

        const { topic1, topic2, topic3, topic4 } = ratings[0];
        const { level1, level2, level3, level4 } = criteria[0];

        const total_credit = parseInt(level1, 10) + parseInt(level2, 10) + parseInt(level3, 10) + parseInt(level4, 10);
        const student_result = ((topic1 * level1) + (topic2 * level2) + (topic3 * level3) + (topic4 * level4)) / total_credit;

        const percent = student_result * 100;
        let status = percent >= 30 ? 'Pass' : 'Fail';
        console.log("percent,status",percent,status)

        // Update the result for the student
        await connection.execute('UPDATE result SET result = ? WHERE userid = ?', [percent, userid]);
        res.status(201).json({ percent, status });

        connection.release();
    } catch (err) {
        console.error('Error during evaluation:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { setcriteria, evaluate };
