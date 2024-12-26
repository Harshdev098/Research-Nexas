const multer = require("multer");
const path = require("path");
const notify = require("../login-system/notification");
const { decodeAccessToken } = require("../login-system/token");
const mysql = require("mysql2/promise"); // Use mysql2 promise API
const db = require("../config/mysql_connection");

const destination = path.resolve(__dirname, "uploads/");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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

// Save the uploaded file data in the database
const save = async (req, res) => {
  try {
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
      console.error("Invalid or missing user information in the token");
      return res.status(401).send("Unauthorized");
    }

    const userid = decodedToken.user;
    const filename = req.file.filename;
    const filepath = `/uploads/${filename}`;

    const connection = await getConnection();

    const sql = "INSERT INTO upload_file_db (userid, filename, filepath, status, fac_mail) VALUES (?,?,?,?,?)";
    const query = mysql.format(sql, [userid, filename, filepath, 0, null]);
    await connection.query(query);
    connection.release();
    console.log("Data Saved");
    // const sub = 'Research Paper Uploaded';
    // const content = `Your Research Paper ${filename} has been uploaded.`;
    // notify(req, res, userEmail, sub, content);

    return res.sendStatus(200); // Success
  } catch (err) {
    console.error("Error during file save:", err);
    return res.status(500).send("Internal Server Error");
  }
};

// Display uploaded research papers for the user
const disp = async (req, res) => {
  console.log("display function")
  try {
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
      console.error("Invalid or missing user information in the token");
      return res.status(401).send("Unauthorized");
    }
    const userid = decodedToken.user;
    const sqlQuery = "SELECT filename FROM upload_file_db WHERE userid = ?";
    const query = mysql.format(sqlQuery, [userid]);
    const connection = await getConnection();
    const [result] = await connection.query(query);
    connection.release();
    const filenames = result.map((row) => row.filename);
    const filepaths = result.map((row) => `/uploads/${row.filename}`);
    console.log("filename",filenames)
    console.log("filepath",filepaths)
    res.json({ filenames, filepaths });
  } catch (error) {
    console.error("Error during disp:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Exporting upload, save, and disp functions
module.exports = { upload, save, disp };
