require("dotenv").config();
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET; // Add this line

// Check for valid secrets
if (!ACCESS_TOKEN || !REFRESH_TOKEN) {
    throw new Error("Missing ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET in environment variables.");
}

// Function for generating access token
function generateAccessToken(user, expireTime = "20m") {
    try {
        const token = jwt.sign(user, ACCESS_TOKEN, { expiresIn: expireTime });
        return token;
    } catch (err) {
        console.log({
            Message: "Error While Generating The Access Token",
            Error: err.message
        });
        return null;
    }
}

// Function for generating refresh token
function generateRefreshToken(user) {
    try {
        const token = jwt.sign(user, REFRESH_TOKEN, { expiresIn: "7d" }); // Valid for 7 days
        return token;
    } catch (err) {
        console.log({
            Message: "Error While Generating The Refresh Token",
            Error: err.message
        });
        return null;
    }
}

// Function for decoding the token
function decodeAccessToken(AuthHeader) {
    if (!AuthHeader) {
        console.log("Authorization header is missing");
        return null;
    }

    const token = AuthHeader.split(" ")[1];
    if (!token) {
        console.log("Token is missing");
        return null;
    }
    try {
        const decodedToken = jwt.verify(token, ACCESS_TOKEN);
        return decodedToken;
    } catch (err) {
        console.log({
            Message: "Error decoding access token:",
            Error: err.message
        });
        return null;
    }
}

// Function for decoding the refresh token
function decodeRefreshToken(token) {
    try {
        const decodedToken = jwt.verify(token, REFRESH_TOKEN);
        return decodedToken;
    } catch (err) {
        console.log({
            Message: "Error decoding refresh token:",
            Error: err.message
        });
        return null;
    }
}

// Generating registration token for faculties 
function registrationToken(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
}

module.exports = { generateAccessToken, decodeAccessToken, generateRefreshToken, decodeRefreshToken, registrationToken };
