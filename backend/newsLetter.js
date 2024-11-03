const mysql = require("mysql");
const db = require("../config/mysql_connection");

const saveNewsLetterData = (req, res) => {

    const query = "INSERT INTO news_letter_tbl (email_id) VALUES (?)";

    db.query(query, [req.body.email], (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error saving email, please try again later." });
        } else {
            res.status(200).json({ message: "Your email has been successfully registered for the newsletter." });
        }
    });
};

module.exports = {
    saveNewsLetterData
};