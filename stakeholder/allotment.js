const mysql = require('mysql')
const notify=require('../login-system/notification')

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

// allot research papers to the faculty 
const allot = async(req, res) => {
    await db.getConnection(async(err, connection) => {
        if (err) throw err;
        const email = req.body.email;
        const name = req.body.name;
        const stu_mail = req.body.stu_mail;
        const search = 'select * from user_table where email=?'
        const searchquery = mysql.format(search, [stu_mail])
        await connection.query(searchquery,async (err,result) => {
            if(err) throw err;
            const userid=result.userid;
            const add = 'insert into faculty(name,email,allotment) values(?,?,?)'
            const query = mysql.format(add, [name, email, userid])
            await connection.query(query, (err, result) => {
                if (err) throw err;
                console.log("faculty allowted")
                res.sendStatus(200)
                const sub='Research Nexas-Allotment'
                // const content=`Hello ${name} Research Papers has been allowted to you for evaluation, the evaluation criteria has been mentioned on the pages.You can open your profile through this emailid ${email} and get forward to evaluate`
                // notify(req,res,email,sub,content);
            })
        })
    })
}

module.exports=allot;
