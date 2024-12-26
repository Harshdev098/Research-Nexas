const mysql = require('mysql2/promise');
const { generateAccessToken } = require('./token');
const notify = require('./notification');
const rateLimit = require('express-rate-limit');
require("dotenv").config();
const db = require('../config/mysql_connection');
const nodemailer = require("nodemailer");

// Connecting to the database using async/await for connection management
const connectToDB = async () => {
    try {
        const connection = await db.getConnection();
        console.log("Database Connected Successfully");
        return connection;
    } catch (err) {
        console.error("Error connecting to the database: ", err);
        throw err;
    }
};

// Sending OTP for email verification
const sendOtp = async (req, res) => {
    const email = req.body.email;
    console.log(email);

    let connection;
    try {
        connection = await connectToDB();

        // Search for the user in the database
        const sqlSearch = "SELECT * FROM user_table WHERE email = ?";
        const [result] = await connection.query(sqlSearch, [email]);

        // If user does not exist
        if (result.length === 0) {
            console.log("User does not exist");
            return res.status(404).send({ message: "User does not exist" });
        }

        // Generate OTP and save it to the database
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpQuery = "UPDATE user_table SET otp = ? WHERE email = ?";
        await connection.query(otpQuery, [verifyCode, email]);

        // Send OTP via notification (could be an email or any other method)
        // notify(req, res, email, "Email Verification", `This is your OTP to verify your email: ${verifyCode}`);

        return res.send({ message: "OTP sent successfully" });

    } catch (err) {
        console.error("Error in sendOtp function:", err);
        res.status(500).send({ message: "Internal Server Error" });
    } finally {
        // Ensure the database connection is released back to the pool
        if (connection) connection.release();
    }
};

// Exporting sendOtp function
module.exports = {
    sendOtp
};
