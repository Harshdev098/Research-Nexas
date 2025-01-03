const mysql = require('mysql2/promise'); // Use promise-based API
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('./token');
const notify = require('./notification');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const db = require('../config/mysql_connection'); // Ensure your connection pool uses mysql2/promise

const validatePassword = (password) => {
    const RegexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#(){}[\]:;<>,.?~`+=-])[A-Za-z\d@$!%*?&^#(){}[\]:;<>,.?~`+=-]{7,}$/;
    return RegexPassword.test(password);
};

const signupRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hr
    max: 10, // max 10 attempts
    message: 'Too many signup attempts, please try again after an hour.',
});

const signinRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 15, // max 15 attempts
    message: 'Too many login attempts, please try again after an hour.',
});

const signup = async (req, res) => {
    const username = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    if (!validatePassword(password)) {
        return res.status(400).json({
            error: 'Password Invalid. Password must be at least 7 characters long and contain at least 1 uppercase & lowercase character, 1 number, and 1 special character.',
        });
    }

    try {
        const hashpassword = await bcrypt.hash(password, 10);
        const connection = await db.getConnection();
        try {
            const sqlSearch = 'SELECT * FROM user_table WHERE email = ? OR username = ?';
            const [result] = await connection.query(sqlSearch, [email, username]);

            if (result.length > 0) {
                if (result[0].email === email) {
                    console.log('A User with Entered Email already exists');
                    return res.status(409).send('Email Already in Use');
                } else if (result[0].username === username) {
                    console.log('A User with Entered Username already exists');
                    return res.status(409).send('Username Already in Use');
                }
            } else {
                const sqlInsert = 'INSERT INTO user_table VALUES (0, ?, ?, ?, null)';
                await connection.query(sqlInsert, [username, email, hashpassword]);
                console.log('Created a new User');
                const sub = 'Signup-Research Nexas';
                notify(req, res, email, sub, `Account created successfully with username ${username}`);
                return res.sendStatus(201);
            }
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const signin = async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    try {
        const connection = await db.getConnection();
        try {
            const sqlSearch = 'SELECT * FROM user_table WHERE email = ?';
            const [result] = await connection.query(sqlSearch, [email]);

            if (result.length === 0) {
                console.log('User does not exist');
                return res.status(404).send('User does not exist');
            }

            const hashpassword = result[0].password;
            if (await bcrypt.compare(password, hashpassword)) {
                console.log('Login Successful');
                const token = generateAccessToken({ user: result[0].userid });
                console.log(token);
                const sub = 'Log in-Research Nexas';
                const content = `Login successfully to the account with username ${result[0].username}`;
                await notify(req, res, result[0].email, sub, content);
                return res.json({ accessToken: token });
            } else {
                return res.status(401).send('Password incorrect');
            }
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const reset = async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const otp = req.body.otp.trim();

    try {
        const connection = await db.getConnection();
        try {
            const sqlSearch = 'SELECT * FROM user_table WHERE email = ?';
            const [result] = await connection.query(sqlSearch, [email]);

            if (result.length === 0) {
                console.log('User does not exist');
                return res.status(404).send('User does not exist');
            }

            const userOtp = result[0].otp;
            if (otp !== userOtp || !userOtp) {
                return res.status(400).json({ success: false, message: 'Invalid OTP' });
            }

            const hashpassword = await bcrypt.hash(password, 10);
            const resetQuery = 'UPDATE user_table SET otp = ?, password = ? WHERE email = ?';
            await connection.query(resetQuery, ['', hashpassword, email]);
            return res.json({ success: true, message: 'Password reset successfully' });
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    signup: [signupRateLimiter, signup],
    signin: [signinRateLimiter, signin],
    reset,
};
