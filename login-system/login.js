const mysql = require('mysql')
const bcrypt = require('bcrypt')
const {generateAccessToken}=require('./token');

require("dotenv").config()
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
})
// connecting database to the server 
db.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Database Connected Successfully")
})

const signup=async (req, res) => {
    const username = req.body.name
    const email = req.body.email
    const hashpassword = await bcrypt.hash(req.body.password, 10);

    db.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM user_table WHERE username=?"
        const search_query = mysql.format(sqlSearch, [email])
        const sqlinsert = "INSERT INTO user_table VALUES (0,?,?,?)"
        const insert_query = mysql.format(sqlinsert, [username, email, hashpassword])
        await connection.query(search_query, async (err, result) => {
            if (err) throw (err)
            console.log("search results")
            console.log(result.length)
            if (result.length != 0) {
                connection.release()
                console.log("user already exists")
                res.sendStatus(409);
            }
            else {
                await connection.query(insert_query, async (err, result) => {
                    connection.release();
                    if (err) throw (err)
                    console.log("Created a new User")
                    // notify(req, res, email);
                    res.sendStatus(201);
                })
            }
        })
    })
}

// login backend 
const signin=(req, res) => {
    const email = req.body.email
    const password = req.body.password;
    db.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "Select * from user_table where email=?"
        const search_query = mysql.format(sqlSearch, [email])
        await connection.query(search_query, async (err, result) => {
            if (err) throw (err)
            if (result.length == 0) {
                console.log("User does not exist")
                res.sendStatus(404)
            }
            else {
                const hashpassword = result[0].password
                if (await bcrypt.compare(password, hashpassword)) {
                    console.log("Login Successful")
                    const token = generateAccessToken({ user: result[0].userid });
                    console.log(token)
                    res.json({ accessToken: token })
                }
                else {
                    res.send("password incorrect")
                }
            }
            connection.release()
        })
    })
}

// exporting signup,signin funtion
module.exports={ signup, signin }