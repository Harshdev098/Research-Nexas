const mysql = require('mysql2/promise'); // Use mysql2 with promises
const bcrypt = require('bcrypt');
const { generateAccessToken, decodeAccessToken } = require('../login-system/token');
require("dotenv").config();
const db = require('../config/mysql_connection');

// Display email on signup page
const dis_mail = async (req, res) => {
    const registrationToken = req.query.token;
    if (!registrationToken) {
        return res.status(400).json({ error: 'Registration token is missing.' });
    }

    try {
        const connection = await db.getConnection();
        const [result] = await connection.execute('SELECT * FROM faculty WHERE token = ?', [registrationToken]);
        connection.release();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Invalid registration token.' });
        }

        const email = result[0].email;
        res.render('fac_signup', { data: email });

    } catch (err) {
        console.error('Error during dis_mail:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Faculty registration
const fac_signup = async (req, res) => {
    const { email, password, name } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);

    try {
        const connection = await db.getConnection();
        const result = await connection.execute('UPDATE faculty SET name = ?, password = ? WHERE email = ?', [name, hashpassword, email]);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).send('Faculty not found');
        }

        console.log('Faculty registered');
        res.sendStatus(201);

    } catch (err) {
        console.error('Error during faculty signup:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Faculty login
const fac_login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await db.getConnection();
        const [result] = await connection.execute('SELECT * FROM faculty WHERE email = ?', [email.trim().toLowerCase()]);
        connection.release();

        if (result.length === 0) {
            return res.status(404).send('Faculty not found');
        }

        const hashpassword = result[0].password;
        const isPasswordValid = await bcrypt.compare(password, hashpassword);

        if (isPasswordValid) {
            const token = await generateAccessToken({ user: result[0].email });
            console.log('Login successful');
            return res.json({ accessToken: token });
        } else {
            return res.status(401).send('Unauthorized');
        }

    } catch (err) {
        console.error('Error during faculty login:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Display papers to the faculty
const Dis_fac_papers = async (req, res) => {
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
        return res.status(401).send('Unauthorized');
    }

    const email = decodedToken.user;

    try {
        const connection = await db.getConnection();
        const [result] = await connection.execute('SELECT * FROM upload_file_db WHERE fac_mail = ?', [email]);
        connection.release();

        const files = result.map(file => ({
            filename: file.filename,
            filepath: file.filepath,
            id: file.sno
        }));

        res.status(200).json({ files });

    } catch (err) {
        console.error('Error displaying faculty papers:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Giverating for paper
const giverating = async (req, res) => {
    const { rating1, rating2, rating3, rating4 } = req.body;
    const paperid = req.query.id;

    try {
        const connection = await db.getConnection();

        // Find the user associated with the paper
        const [paperResult] = await connection.execute('SELECT * FROM upload_file_db WHERE sno = ?', [paperid]);
        if (paperResult.length === 0) {
            connection.release();
            return res.status(404).send('Paper not found');
        }

        const userid = paperResult[0].userid;

        // Insert the ratings into the result table
        const insertRatingQuery = 'INSERT INTO result (userid, topic1, topic2, topic3, topic4) VALUES (?, ?, ?, ?, ?)';
        await connection.execute(insertRatingQuery, [userid, rating1, rating2, rating3, rating4]);

        connection.release();

        console.log('Rating saved');
        res.sendStatus(200);

    } catch (err) {
        console.error('Error saving rating:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { Dis_fac_papers, fac_login, fac_signup, dis_mail, giverating };
