const mysql = require('mysql2/promise');
const notify = require("../login-system/notification");
const { decodeAccessToken } = require("../login-system/token");
const { registrationToken } = require("../login-system/token");
require("dotenv").config();
const db = require("../config/mysql_connection"); 


const allot = async (req, res) => {
  const email = req.body.email;
  console.log(email);
  const paperid = req.query.id;
  try {
    const connection = await db.getConnection(); 
    const [result] = await connection.execute("SELECT * FROM faculty WHERE email = ?", [email]);
    if (result.length !== 0) {
      await connection.execute("UPDATE upload_file_db SET fac_mail = ? WHERE sno = ?", [email, paperid]);
      console.log("Table updated");
      res.sendStatus(200);
    } else {
      const token = registrationToken(email);
      console.log(token);
      await connection.execute("INSERT INTO faculty VALUES (?, NULL, NULL, ?)", [email, token]);
      const sub = "Allotment- Research Nexas";
      const link = `/fac_signup?token=${token}`;
      const content = `Stakeholder of your college has registered you to the Research Nexas with this email ${email}. Click here to complete your registration: ${link}`;
      await notify(req, res, email, sub, content);
      await connection.execute("UPDATE upload_file_db SET fac_mail = ? WHERE sno = ?", [email, paperid]);
      console.log("Table updated");
      res.sendStatus(200);
    }

    connection.release();

  } catch (err) {
    console.log("Error during allotment:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Display papers to the stakeholder
const DisplayPapers = async (req, res) => {
  try {
    const decodedToken = decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
      console.error("Invalid or missing user information in the token");
      return res.status(401).send("Unauthorized");
    }
    const userid = decodedToken.user;
    const connection = await db.getConnection(); 
    const [result] = await connection.execute("SELECT * FROM stk_holder WHERE id = ?", [userid]);
    if (result.length !== 0) {
      const col_name = result[0].col_name;
      const [files] = await connection.execute(
        "SELECT up.status, up.sno, info.name, info.email, up.filename, up.filepath, info.col_name FROM upload_file_db AS up INNER JOIN info_table AS info ON up.userid = info.id"
      );
      const matchingFiles = files.filter(file => file.col_name === col_name);
      const fileData = matchingFiles.map(file => ({
        filename: file.filename,
        name: file.name,
        collegename: file.col_name,
        status: file.status,
        id: file.sno
      }));
      res.status(200).send(fileData);
    } else {
      res.status(404).send("User not found");
    }
    connection.release();
  } catch (err) {
    console.log("Error displaying papers:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { allot, DisplayPapers };
