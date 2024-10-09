const mysql = require('mysql')
const { decodeAccessToken } = require('../login-system/token')

require("dotenv").config()
const  db  = require('../config/mysql_connection')

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
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const stu_college = mysql.format('select * from info_table where id=?', [userid]);
        connection.query(stu_college, async (err, result) => {
            if (err) {
                console.error(err);
                connection.release();
                return res.status(500).send('Internal Server Error');
            }
            const stu_col_name = result[0].col_name;
            const credit = mysql.format('select * from criteria where college=?', [stu_col_name]);
            await connection.query(credit, async (err, result) => {
                if (err) {
                    console.error(err);
                    connection.release();
                    return res.status(500).send('Internal Server Error');
                }
                if (result.length !== 0) {
                    const credit1 = result[0].level1;
                    const credit2 = result[0].level2;
                    const credit3 = result[0].level3;
                    const credit4 = result[0].level4;
                    console.log(credit1, credit2, credit3, credit4);
                    const total_credit = parseInt(credit1, 10) + parseInt(credit2, 10) + parseInt(credit3, 10) + parseInt(credit4, 10);

                    const rating = mysql.format('select * from result where userid=?', [userid]);
                    await connection.query(rating, (err, result) => {
                        if (err) {
                            console.error(err);
                            connection.release();
                            return res.status(500).send('Internal Server Error');
                        }
                        if (result.length !== 0) {
                            const rating1 = result[0].topic1;
                            const rating2 = result[0].topic2;
                            const rating3 = result[0].topic3;
                            const rating4 = result[0].topic4;
                            const stu_result = ((rating1 * credit1) + (rating2 * credit2) + (rating3 * credit3) + (rating4 * credit4)) / total_credit;
                            console.log(stu_result);
                            const percent = stu_result * 100;
                            console.log(percent);
                            let status = "Pass";
                            const update = mysql.format('update result set result=? where userid=?', [percent, userid]);
                            connection.query(update, (err, result) => {
                                if (err) {
                                    console.error(err);
                                    connection.release();
                                    return res.status(500).send('Internal Server Error');
                                }
                                if (percent >= 30) {
                                    res.status(201).json({ percent, status });
                                } else {
                                    status = "Fail";
                                    res.status(201).json({ percent, status });
                                }
                                connection.release();
                            });
                        } else {
                            res.sendStatus(404);
                            connection.release();
                        }
                    });
                } else {
                    res.sendStatus(404);
                    connection.release();
                }
            });
        });
    });
};


module.exports = { setcriteria, evaluate }