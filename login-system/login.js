const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, decodeRefreshToken } = require('./token');
const notify = require('./notification');
const rateLimit = require('express-rate-limit');
require("dotenv").config();
const db = require('../config/mysql_connection');

// Connecting database to the server 
db.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Database Connected Successfully");
});

// Validate password strength
const validatePassword = (password) => {
    const RegexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    return RegexPassword.test(password);
};

// Rate limiting for signup
const signupRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // max 10 attempts 
    message: "Too many signup attempts, please try again after an hour."
});

// Rate limiting for signin
const signinRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 15, // max 15 attempts 
    message: "Too many login attempts, please try again after an hour."
});

// Signup function
const signup = async (req, res) => {
    const username = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    if (!validatePassword(password)) {
        return res.status(400).json({
            error: "Password Invalid ... Password must be at least 7 characters long and must contain at least 1 uppercase & lowercase character, 1 number, and 1 special character."
        });
    }

    const hashpassword = await bcrypt.hash(req.body.password, 10);

    db.getConnection(async (err, connection) => {
        if (err) throw (err);
        const sqlSearch = "SELECT * FROM user_table WHERE email=? OR username=?";
        const search_query = mysql.format(sqlSearch, [email, username]);

        const sqlInsert = "INSERT INTO user_table VALUES (0,?,?,?)";
        const insert_query = mysql.format(sqlInsert, [username, email, hashpassword]);

        await connection.query(search_query, async (err, result) => {
            if (err) throw (err);
            console.log("search results", result.length);
            if (result.length != 0) {
                connection.release();

                if (result[0].email === email) {
                    console.log("A User with Entered Email already exists");
                    res.status(404).send("Email Already in Use");
                } else if (result[0].username === username) {
                    console.log("A User with Entered Username already exists");
                    res.status(404).send("Username Already in Use");
                }
            } else {
                await connection.query(insert_query, async (err, result) => {
                    connection.release();
                    if (err) throw (err);
                    console.log("Created a new User");
                    const sub = 'Signup-Research Nexas';
                    // const content = `Account created successfully with username ${result[0].username} in Research Nexas`;
                    // notify(req, res, result[0].email, sub, content);
                    res.sendStatus(201);
                });
            }
        });
    });
}

// Signin function
const signin = async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    db.getConnection(async (err, connection) => {
        if (err) throw (err);
        const sqlSearch = "SELECT * FROM user_table WHERE email=?";
        const search_query = mysql.format(sqlSearch, [email]);
        await connection.query(search_query, async (err, result) => {
            if (err) throw (err);
            if (result.length == 0) {
                console.log("User does not exist");
                return res.sendStatus(404);
            } else {
                const hashpassword = result[0].password;
                if (await bcrypt.compare(password, hashpassword)) {
                    console.log("Login Successful");
                    const accessToken = generateAccessToken({ user: result[0].userid });
                    const refreshToken = generateRefreshToken({ user: result[0].userid }); // Generate refresh token
                    console.log(accessToken, refreshToken);
                    res.json({ accessToken, refreshToken }); // Send both tokens
                } else {
                    res.status(401).send("Password incorrect");
                }
            }
            connection.release();
        });
    });
}

// Refresh token function
const refreshAccessToken = (req, res) => {
    const refreshToken = req.body.refreshToken; // Assume the refresh token is sent in the request body
    if (!refreshToken) return res.sendStatus(401); // Unauthorized if refresh token is not present

    const decoded = decodeRefreshToken(refreshToken);
    if (!decoded) return res.sendStatus(403); // Forbidden if refresh token is invalid

    // Generate new access token
    const newAccessToken = generateAccessToken({ user: decoded.user });
    res.json({ accessToken: newAccessToken });
}

// Exporting signup, signin, refresh token, and logout functions
module.exports = {
    signup: [signupRateLimiter, signup],
    signin: [signinRateLimiter, signin],
    refreshAccessToken,
};
