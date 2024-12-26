const express = require("express");
const mysql = require("mysql2/promise"); // Use mysql2 promise API
const db = require("../config/mysql_connection");
const { decodeAccessToken } = require("../login-system/token");

const app = express();
app.use(express.json());

// Helper function to get the database connection
const getConnection = async () => {
  try {
    const connection = await db.getConnection();
    return connection;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
};

// Info endpoint to save user data
const info = async (req, res) => {
  const decodedToken = decodeAccessToken(req.headers.authorization);
  if (!decodedToken || !decodedToken.user) {
    console.error("Invalid or missing user information in the token");
    return res.status(401).send("Unauthorized");
  }

  const userid = decodedToken.user;
  const { name, email, col_name, state, course, year, dept } = req.body;

  try {
    const connection = await getConnection();

    // Check if the email already exists in the info_table
    const emailCheckQuery =
      "SELECT COUNT(*) AS count FROM info_table WHERE email = ?";
    const [emailCheckResult] = await connection.query(emailCheckQuery, [email]);

    // If email exists, return a 400 error
    if (emailCheckResult[0].count > 0) {
      return res.sendStatus(400);
    }

    // Insert new user information into the table
    const sql =
      "INSERT INTO info_table (id, name, email, col_name, state, year, course) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await connection.query(sql, [
      userid,
      name.trim(),
      email.trim(),
      col_name.trim(),
      state,
      year,
      course.trim(),
      dept.trim(),
    ]);

    console.log("Data Saved");
    res.sendStatus(200); // Success

  } catch (err) {
    console.error("Error during info insertion:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Check if the user info exists
const check = async (req, res) => {
  const decodedToken = decodeAccessToken(req.headers.authorization);
  if (!decodedToken || !decodedToken.user) {
    console.error("Invalid or missing user information in the token");
    return res.status(401).send("Unauthorized");
  }

  const userid = decodedToken.user;

  try {
    const connection = await getConnection();

    const searchQuery = "SELECT * FROM info_table WHERE id = ?";
    const [result] = await connection.query(searchQuery, [userid]);

    if (result.length !== 0) {
      console.log("Info checked");
      return res.sendStatus(201); // User info exists
    }

    res.sendStatus(404); // User info not found

  } catch (err) {
    console.error("Error during info check:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Exporting the functions
module.exports = { info, check };
