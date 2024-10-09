const mysql=require('mysql')
const bcrypt=require('bcrypt')
const {generateAccessToken}=require('../login-system/token');

require("dotenv").config()
const  db  = require('../config/mysql_connection')

const stk_signup=async(req,res)=>{
    const colname=req.body.colname.trim();
    const email=req.body.email.trim().toLowerCase();
    const password=req.body.password.trim();
    const hashpassword=await bcrypt.hash(password,10)
    db.getConnection(async(err,connection)=>{
        if(err) throw err;
        const userSearch="SELECT * FROM stk_holder where email=?";
        const searchquery=mysql.format(userSearch,[email]);
        const userinsert="INSERT INTO stk_holder VALUES (0,?,?,?)";
        const insertquery=mysql.format(userinsert,[colname,email,hashpassword]);
        await connection.query(searchquery,async(err,result)=>{
            if(err) throw err;
            if(result.length!=0){
                console.log("user already exist")
                res.sendStatus(409);
                connection.release();
            }
            else{
                await connection.query(insertquery,async(err,result)=>{
                    if(err) throw err;
                    res.sendStatus(201);
                    console.log("user created");
                    connection.release();
                })
            }
        })
    })
}

const stk_signin=((req,res)=>{
    const email=req.body.email.trim();
    const password=req.body.password.trim();
    db.getConnection(async(err,connection)=>{
        if(err){
            console.log("internal server error"+err);
        }
        const searchquery="SELECT * FROM stk_holder where email=?"
        const query=mysql.format(searchquery,[email])
        await connection.query(query,async(err,result)=>{
            if(err){
                console.log("internal server error"+err);
            }
            if(result.length==0){
                console.log("User does not exist")
                res.sendStatus(409)
            }
            else{
                const hashedpassword=result[0].password;
                if(await bcrypt.compare(password,hashedpassword)){
                    console.log("Logined Successfully")
                    connection.release()
                    const token = generateAccessToken({ user: result[0].id });
                    res.json({ accessToken: token })
                }
                else{
                    console.log("Incorrect password")
                    res.sendStatus(401)
                }
            }
        })
    })
})

module.exports={stk_signup,stk_signin}