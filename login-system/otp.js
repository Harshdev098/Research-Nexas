const mysql = require('mysql')
const bcrypt = require('bcrypt')
const {generateAccessToken}=require('./token');
const notify = require('./notification');
const rateLimit = require('express-rate-limit')
require("dotenv").config()
const  db  = require('../config/mysql_connection')
const nodemailer = require("nodemailer");

// connecting database to the server
db.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Database Connected Successfully")
})

const sendOtp = (req, res)=>{
    const email = req.body.email;
    console.log(email);
    

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
                const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

                const otp_query = `Update user_table set otp=? where email=?`
                const query = mysql.format(otp_query, [verifyCode, email])

                await connection.query(query, async (err, result) => {
                    if(err) throw (err)
                })

                notify(req, res, email, "Email Verification", `This is otp to verify your email: ${verifyCode}`);
                
                return res.send({message: "otp sent successfully"})
            }
            connection.release()
        })
    })
}

// exporting signup,signin funtion
module.exports={
    sendOtp
}
