const mysql = require("mysql2/promise");
const db = require("../config/mysql_connection");

const saveNewsLetterData = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const query = "INSERT INTO news_letter_tbl (email_id) VALUES (?)";

  try {
    const connection = await db.getConnection();
    const [results] = await connection.query(query, [email]);

    connection.release();

    res.status(200).json({
      message: "Your email has been successfully registered for the newsletter."
    });
  } catch (error) {
    console.error("Error saving email:", error);
    res.status(500).json({
      message: "Error saving email, please try again later."
    });
  }
};

module.exports = {
  saveNewsLetterData
};
