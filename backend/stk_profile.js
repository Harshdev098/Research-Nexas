const { name } = require('ejs')
const { decodeAccessToken } = require('../login-system/token')
const  db  = require('../config/mysql_connection')
const mysql = require('mysql')


const stk_display = async (req, res) => {
    const decodedtoken = decodeAccessToken(req.headers.authorization);
    if (!decodedtoken || !decodedtoken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedtoken.user;
    await db.getConnection(async (err, connection) => {
        if (err) throw err;
        const sqlquery = "select * from stk_holder where id=?"
        const query = mysql.format(sqlquery, [userid])
        await connection.query(query, async(err, result) => {
            if (err) throw err;
            // console.log("result", result)
            const col_name = result[0].col_name
            const email = result[0].email;
            // console.log(col_name, email)
            const search = mysql.format('select * from criteria where college=?', [col_name])
            await connection.query(search, (err, result) => {
                if (err) throw err;
                const credit1 = result[0].level1
                const credit2 = result[0].level2
                const credit3 = result[0].level3
                const credit4 = result[0].level4
                // const topic5 = result[0].topic
                // const credit5 = result[0].level5
                // console.log(credit1, credit2, credit3, credit4)
                res.json({ credit1, credit2, credit3, credit4,col_name,email })
            })
        })
    })
}

// const dis_evaluation_criteria=(req,res)=>{
//     const decodedtoken = decodeAccessToken(req.headers.authorization);
//     if (!decodedtoken || !decodedtoken.user) {
//         console.error('Invalid or missing user information in the token');
//         return res.status(401).send('Unauthorized');
//     }
//     const userid=decodedtoken.user;
//     db.getConnection((err,connection)=>{
//         if(err) throw err;
//         const query=mysql.format('select * from stk_holder where id=?',[userid])
//         connection.query(query,(err,result)=>{
//             if(err) throw err;
//             const college=result[0].col_name
//             console.log(college)
//             const search=mysql.format('select * from criteria where college=?',[college])
//             connection.query(search,(err,result)=>{
//                 if(err) throw err;
//                 const credit1=result[0].level1
//                 const credit2=result[0].level2
//                 const credit3=result[0].level3
//                 const credit4=result[0].level4
//                 const topic5=result[0].topic
//                 const credit5=result[0].level5
//                 console.log(credit1,credit2,credit3,credit4,topic5,credit5)
//                 res.send(200).json({credit1,credit2,credit3,credit4,topic5,credit5})
//             })
//         })
//     })
// }

module.exports = { stk_display }