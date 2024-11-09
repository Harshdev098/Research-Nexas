const mysql = require('mysql');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
});

// Custom method to establish and log the initial connection status
function initializeConnection() {
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error connecting to the database:", err.message);
        } else {
            console.log("Successfully connected to the database with ID:", connection.threadId);
            connection.release(); // Release connection after success
        }
    });
}

// Run the initializeConnection method on module load
initializeConnection();

module.exports = db;