const { name } = require('ejs')
const {decodeAccessToken}=require('../login-system/token')
const mysql=require('mysql')

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

const stk_display=async(req,res)=>{
    const decodedtoken = decodeAccessToken(req.headers.authorization);
    if (!decodedtoken || !decodedtoken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid=decodedtoken.user;
    await db.getConnection(async(err,connection)=>{
        if(err) throw err;
        const sqlquery="select * from stk_holder where id=?"
        const query=mysql.format(sqlquery,[userid])
        await connection.query(query,(err,result)=>{
            if(err) throw err;
            // console.log("result",result)
            const col_name=result[0].col_name
            const email=result[0].email;
            // console.log(col_name,email)
            res.status(200).json({col_name,email});
            connection.release();
        })
    })
}

module.exports={stk_display}