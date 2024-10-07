const mysql = require('mysql')
const bcrypt = require('bcrypt')
const notify = require('../login-system/notification')
const { generateAccessToken,decodeAccessToken } = require('../login-system/token')

require("dotenv").config()
const  db  = require('../config/mysql_connection')



// displaying emial on signup page 
const dis_mail = (req, res) => {
    const registrationToken = req.query.token;
    if (!registrationToken) {
        return res.status(400).json({ error: 'Registration token is missing.' });
    }
    db.getConnection(async (err, connection) => {
        if (err) throw err;
        const search = mysql.format('select * from faculty where token=?', [registrationToken])
        await connection.query(search, (err, result) => {
            if (err) throw err;
            const email = result[0].email
            res.render('fac_signup', { data: email })
        })
    })
}

// faculty registration 
const fac_signup = async (req, res) => {
    const email = req.body.email
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    const name = req.body.name
    await db.getConnection(async (err, connection) => {
        if (err) throw err;
        const insertquery = mysql.format('update faculty set name=?, password=? where email=?', [name, hashpassword, email]);
        await connection.query(insertquery, (err, result) => {
            if (err) throw err;
            console.log('faculty registered')
            res.sendStatus(201)
        })
    })
}

// faculty login 
const fac_login = async (req, res) => {
    const email = req.body.email.trim().toLowerCase()
    const password = req.body.password
    await db.getConnection((err, connection) => {
        if (err) throw err;
        const search = mysql.format('select * from faculty where email=?', [email])
        connection.query(search, async (err, result) => {
            if (err) throw err;
            // console.log(result)
            if (result.length != 0) {
                const hashpassword = result[0].password
                // console.log(hashpassword)
                if (await bcrypt.compare(password,hashpassword)) {
                    const token =await generateAccessToken({ user: result[0].email });
                    console.log(token)
                    console.log("login successfully")
                    res.json({ accessToken: token })
                }
                else {
                    res.status(401).send('Unauthorized')
                }
            }
            else {
                res.sendStatus(404);
            }
        })
    })
}

// displaying papers to the faculty 
const Dis_fac_papers = async (req, res) => {
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const email = decodedToken.user;
    db.getConnection(async (err, connection) => {
        if (err) throw err;
        const searchquery = mysql.format('select * from upload_file_db where fac_mail=?', [email])
        await connection.query(searchquery, (err, result) => {
            if (err) throw err;
            // console.log(result)
            const files = result.map(file => ({
                filename: file.filename,
                filepath: file.filepath,
                id: file.sno
            }))
            // console.log(files)
            res.status(200).json({ files })
        })
    })
}

const giverating=(req,res)=>{
    const rating1=req.body.rating1
    const rating2=req.body.rating2
    const rating3=req.body.rating3
    const rating4=req.body.rating4
    // const rating5=req.body.rating5
    const paperid=req.query.id;
    db.getConnection((err,connection)=>{
        if(err) throw err;
        const searchuser=mysql.format('select * from upload_file_db where sno=?',[paperid])
        connection.query(searchuser,(err,result)=>{
            if(err) throw err;
            if(result.length!=0){
                const userid=result[0].userid;
                const insertrating="insert into result(userid,topic1,topic2,topic3,topic4) values(?,?,?,?,?)"
                const insert=mysql.format(insertrating,[userid,rating1,rating2,rating3,rating4])
                connection.query(insert,(err,result)=>{
                    if(err) throw err;
                    console.log('rating saved')
                    res.sendStatus(200)
                    connection.release()
                })
            }
        })
    })
}

module.exports = { Dis_fac_papers, fac_login, fac_signup, dis_mail, giverating }