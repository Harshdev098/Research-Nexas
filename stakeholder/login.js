const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../login-system/token');
require("dotenv").config();
const db = require('../config/mysql_connection');  // Assuming mysql_connection is set up for promise pool

// Sign Up Endpoint
const stk_signup = async (req, res) => {
    const colname = req.body.colname.trim();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    try {
        const hashpassword = await bcrypt.hash(password, 10);
        const connection = await db.getConnection();
        const [result] = await connection.execute("SELECT * FROM stk_holder WHERE email = ?", [email]);

        if (result.length !== 0) {
            console.log("User already exists");
            res.sendStatus(409);
        } else {
            // Insert new user
            await connection.execute("INSERT INTO stk_holder (col_name, email, password) VALUES (?, ?, ?)", [colname, email, hashpassword]);
            console.log("User created");
            res.sendStatus(201);
        }

        connection.release(); 
    } catch (err) {
        console.log("Error during signup:", err);
        res.status(500).send("Internal Server Error");
    }
};

// Sign In Endpoint
const stk_signin = async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    try {
        const connection = await db.getConnection();
        const [result] = await connection.execute("SELECT * FROM stk_holder WHERE email = ?", [email]);
        if (result.length === 0) {
            console.log("User does not exist");
            res.sendStatus(409);
        } else {
            const hashedpassword = result[0].password;
            if (await bcrypt.compare(password, hashedpassword)) {
                console.log("Login Successful");
                const token = generateAccessToken({ user: result[0].id });
                res.json({ accessToken: token });
            } else {
                console.log("Incorrect password");
                res.sendStatus(401);
            }
        }
        connection.release(); 
    } catch (err) {
        console.log("Error during signin:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { stk_signup, stk_signin };
