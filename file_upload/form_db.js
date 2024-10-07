const express = require('express')
const mysql = require('mysql')
const {decodeAccessToken}=require('../login-system/token')
const app = express();
app.use(express.json());

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

const info=(req,res)=>{
    const decodedtoken = decodeAccessToken(req.headers.authorization);
    if (!decodedtoken || !decodedtoken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid=decodedtoken.user;
    console.log(userid)
    const name=req.body.name.trim();
    const email=req.body.email.trim();
    const col_name=req.body.col_name.trim();
    const state=req.body.state;
    const course=req.body.course.trim();
    const year=req.body.year;
    const dept=req.body.dept.trim();
    db.getConnection(async(err,connection)=>{
        if(err) throw err;
        const sql="INSERT INTO info_table VALUES (?,?,?,?,?,?,?)"
        const sqlinsert=mysql.format(sql,[userid,name,email,col_name,state,year,course])
        await connection.query(sqlinsert,async (err,result)=>{
            if(err) throw err;
            connection.release();
            console.log("Data Saved");
            res.sendStatus(200);
        })
    })
}

const check=(req,res)=>{
    const decodedtoken = decodeAccessToken(req.headers.authorization);
    if (!decodedtoken || !decodedtoken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid=decodedtoken.user;
    db.getConnection(async(err,connection)=>{
        if(err) throw err;
        const search="SELECT * FROM info_table where id=?"
        const searchquery=mysql.format(search,[userid])
        await connection.query(searchquery,async(err,result)=>{
            if(err) throw err;
            if(result.length!=0){
                console.log('info checked')
                res.sendStatus(201)
                connection.release()
            }
            else{
                connection.release()
            }
        })
    })
}

// exporting info
module.exports={info,check};