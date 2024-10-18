const mysql = require('mysql');

// MySQL connection pool setup
const db = mysql.createConnection({
  host: 'localhost',       // or your DB host if remote
  user: 'root',            // MySQL username
  password: '',            // MySQL password
  database: 'research_nexas' // Database name you created
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database');
});

module.exports = db;
