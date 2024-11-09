const express = require("express");
const mysql = require("mysql");
const db = require("../config/mysql_connection");
const { decodeAccessToken } = require("../login-system/token");
const app = express();
app.use(express.json());

const info = (req, res) => {
  const decodedtoken = decodeAccessToken(req.headers.authorization);
  if (!decodedtoken || !decodedtoken.user) {
    console.error("Invalid or missing user information in the token");
    return res.status(401).send("Unauthorized");
  }

  const userid = decodedtoken.user;

  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const col_name = req.body.col_name.trim();
  const state = req.body.state;
  const course = req.body.course.trim();
  const year = req.body.year;
  const dept = req.body.dept.trim();
  const interests = req.body.interests ? req.body.interests.trim() : null; // Extract interests

  db.getConnection(async (err, connection) => {
    if (err) throw err;

    // Check if the email already exists in the info_table
    const emailCheckQuery =
      "SELECT COUNT(*) AS count FROM info_table WHERE email = ?";
    const emailCheckSql = mysql.format(emailCheckQuery, [email]);

    await connection.query(emailCheckSql, async (err, results) => {
      if (err) {
        connection.release();
        throw err;
      }

      // Check if the email already exists
      if (results[0].count > 0) {
        connection.release();
        return res.sendStatus(400);
      }

      // Proceed to insert the data if the email does not exist
      const sql = "INSERT INTO info_table VALUES (?,?,?,?,?,?,?,?)"; // Add interests to the insert statement
      const sqlInsert = mysql.format(sql, [userid, name, email, col_name, state, year, course, interests]); // Include interests

      await connection.query(sqlInsert, async (err, result) => {
        if (err) {
          connection.release();
          throw err;
        }

        connection.release();
        console.log("Data Saved");
        res.sendStatus(200);
      });
    });
  });
};

const check = (req, res) => {
  const decodedtoken = decodeAccessToken(req.headers.authorization);
  if (!decodedtoken || !decodedtoken.user) {
    console.error("Invalid or missing user information in the token");
    return res.status(401).send("Unauthorized");
  }
  const userid = decodedtoken.user;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const search = "SELECT * FROM info_table WHERE id=?";
    const searchquery = mysql.format(search, [userid]);
    await connection.query(searchquery, async (err, result) => {
      if (err) throw err;
      if (result.length != 0) {
        console.log("info checked");
        // Optionally, you can return the interests here as well
        res.status(200).json({
          name: result[0].name,
          email: result[0].email,
          col_name: result[0].col_name,
          state: result[0].state,
          year: result[0].year,
          course: result[0].course,
          interests: result[0].interests // Include interests in the response
        });
        connection.release();
      } else {
        connection.release();
        res.sendStatus(404); // Respond with 404 if no user info found
      }
    });
  });
};

// exporting info
module.exports = { info, check };