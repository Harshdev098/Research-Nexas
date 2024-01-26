const mysql = require('mysql')
const { decodeAccessToken } = require('../login-system/token')

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

const setcriteria = async (req, res) => {
    const level1 = req.body.value1
    const level2 = req.body.value2
    const level3 = req.body.value3
    const level4 = req.body.value4
    const level5 = req.body.value5
    const topic = req.body.topic
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const id = decodedToken.user;
    db.getConnection(async (err, connection) => {
        if (err) throw err
        const searchcol_name = mysql.format('select * from stk_holder where id=?', [id])
        await connection.query(searchcol_name, async (err, result) => {
            if (err) { console.log('internal server error'); res.sendStatus(501) }
            const col_name = result[0].col_name;
            console.log(col_name)
            const insert = mysql.format('select * from criteria where college=?', [col_name])
            await connection.query(insert, async (err, result) => {
                if (err) { console.log('internal server error'); res.sendStatus(501) }
                if (result.length != 0) {
                    console.log('criteria already present')
                    res.sendStatus(401)
                    connection.release()
                }
                else {
                    const insertquery = 'insert into criteria values(?,?,?,?,?,?,?,?)'
                    const query2 = mysql.format(insertquery, [id, col_name, level1, level2, level3, level4, topic, level5])
                    await connection.query(query2, (err, result) => {
                        if (err) { console.log('internal server error'); res.sendStatus(501) }
                        console.log('Evaluation criteria set')
                        res.sendStatus(200)
                        connection.release()
                    })
                }
            })
        })
    })
}


// evaluating the result 
const evaluate = async (req, res) => {
    const decodedToken = decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user;
    await db.getConnection((err, connection) => {
        if (err) throw err;
        const stu_college = mysql.format('select * from info_table where id=?', [userid])
        connection.query(stu_college, async (err, result) => {
            if (err) throw err;
            const stu_col_name = result[0].col_name;
            const credit = mysql.format('select * from criteria where college=?', [stu_col_name])
            await connection.query(credit, async (err, result) => {
                if (err) throw err;
                if (result.length != 0) {
                    const credit1 = result.level1
                    const credit2 = result.level2
                    const credit3 = result.level3
                    const credit4 = result.level4
                    const credit5 = result.level5
                    const total_credit = parseInt(credit1, 10) + parseInt(credit2, 10) + parseInt(credit3, 10) + parseInt(credit4, 10)
                    // const total_credit=credit1+credit2+credit3+credit4
                    const rating = mysql.format('select * from result where userid=?', [userid])
                    await connection.query(rating, (err, result) => {
                        if (err) throw err;
                        if (result.length != 0) {
                            const rating1 = result.topic1;
                            const rating2 = result.topic2;
                            const rating3 = result.topic3;
                            const rating4 = result.topic4;
                            const rating5 = result.topic5;
                            const stu_result = ((rating1 * credit1) + (rating2 * credit2) + (rating3 * credit3) + (rating4 * credit4) + (rating5 * credit5)) / total_credit
                            const percent = stu_result * 100;
                            let status = "Pass"
                            const update=mysql.format('update result set result=? where userid=?',[percent,userid])
                            connection.query(update,(err,result)=>{
                                if(err) throw err;
                                if (percent >= 30) {
                                    res.send(201).json({ percent, status })
                                    connection.release()
                                }
                                else {
                                    status = "Fail"
                                    res.send(201).json({ percent, status })
                                    connection.release()
                                }
                            })
                        }
                        else {
                            res.sendStatus(404)
                            connection.release()
                        }
                    })
                }
                else {
                    res.sendStatus(404)
                    connection.release()
                }
            })
        })
    })
}

module.exports = { setcriteria, evaluate }