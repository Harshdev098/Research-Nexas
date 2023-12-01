const express = require('express')
const mysql = require('mysql')
const app = express();
app.use(express.json());

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'user',
    password: 'Ha@96168737',
    database: 'user_DB',
    port: '3306'
 })
 
const info=(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const col_name=req.body.col_name;
    const state=req.body.state;
    const course=req.body.course;
    const year=req.body.year;
    db.getConnection(async(err,connection)=>{
        if(err) throw err;
        const sql="INSERT INTO info_table VALUES (0,?,?,?,?,?,?)"
        const sqlinsert=mysql.format(sql,[name,email,col_name,state,year,course])
        await connection.query(sqlinsert,async (err,result)=>{
            if(err) throw err;
            connection.release();
            console.log("Data Saved");
            res.sendStatus(200);
        })
    })
}
// exporting info
module.exports=info;