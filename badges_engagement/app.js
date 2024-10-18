const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Routes
const badgesRouter = require('./routes/badges');
app.use('/badges', badgesRouter);

// Home route
app.get('/', (req, res) => {
  res.render('layout', { page: 'profile' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
