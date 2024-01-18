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
        const search = "SELECT * FROM criteria where stk_id=?"
        const query = mysql.format(search, [id])
        await connection.query(query, async (err, result) => {
            if (err) {
                console.log('internal server error');
                res.sendStatus(501)
                connection.release()
            }
            if (result.length != 0) {
                console.log('criteria already present')
                res.sendStatus(401)
                connection.release()
            }
            else {
                const insertquery = 'insert into criteria values(?,?,?,?,?,?,?)'
                const query2 = mysql.format(insertquery, [id, level1, level2, level3, level4, topic, level5])
                await connection.query(query2, (err, result) => {
                    if (err) { console.log('internal server error'); res.sendStatus(501) }
                    console.log('Evaluation criteria set')
                    res.sendStatus(200)
                    connection.release()
                })
            }
        })
    })

}

module.exports = { setcriteria }