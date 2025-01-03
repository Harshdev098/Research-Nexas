const mysql = require('mysql2/promise');
const { generateAccessToken } = require('./token');
const notify = require('./notification');
const rateLimit = require('express-rate-limit');
require("dotenv").config();
const db = require('../config/mysql_connection');
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator'); // Import otp-generator


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
        console.log("Connected to the database");

        // Clear expired OTPs for this user
        const clearExpiredOtpQuery = 'UPDATE user_table SET otp = NULL, otp_expiry = NULL WHERE otp_expiry < ?';
        await connection.query(clearExpiredOtpQuery, [Date.now()]);

        // // Check if a valid OTP already exists
        // const checkExistingOtpQuery = "SELECT otp_expiry FROM user_table WHERE email = ? AND otp_expiry > ?";
        // const [existingOtp] = await connection.query(checkExistingOtpQuery, [email, Date.now()]);

        // if (existingOtp.length > 0) {
        //     return res.status(400).send({ message: "An OTP is already active. Please wait for it to expire." });
        // }

        // Search for the user in the database
        const sqlSearch = "SELECT * FROM user_table WHERE email = ?";
        const [result] = await connection.query(sqlSearch, [email]);

        // If user does not exist
        if (result.length === 0) {
            console.log("User does not exist");
            return res.status(404).send({ message: "User does not exist" });
        }

        // Generate OTP and save it to the database
        const verifyCode = otpGenerator.generate(6, {
            upperCaseAlphabets: true,   // Include uppercase letters
            lowerCaseAlphabets: true,   // Include lowercase letters
            specialChars: true,         // Include special characters
            digits: true                // Include digits
          });;
        console.log(verifyCode);
        const expirationTime = Date.now() + 2 * 60 * 1000; // 2 minutes
        

        const otpQuery = "UPDATE user_table SET otp = ?, otp_expiry = ? WHERE email = ?";
        await connection.query(otpQuery, [verifyCode,expirationTime, email]);

        // Schedule immediate cleanup after 2 minutes
        setTimeout(async () => {
            let timeoutConnection;
            try {
                timeoutConnection = await connectToDB();
                await timeoutConnection.query(
                    'UPDATE user_table SET otp = NULL, otp_expiry = NULL WHERE email = ? AND otp_expiry < ?',
                    [email, Date.now()]
                );
                console.log(`Expired OTP cleared for ${email}`);
            } catch (err) {
                console.error(`Error clearing OTP for ${email}:`, err);
            } finally {
                if (timeoutConnection) timeoutConnection.release();
            }
        }, 2 * 60 * 1000);
        
        // Send OTP via notification (could be an email or any other method)
        notify(req, res, email, "Email Verification", `This is your OTP to verify your email: ${verifyCode}`);

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
