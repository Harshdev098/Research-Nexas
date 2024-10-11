const mysql = require('mysql')
const path = require('path')
const ejs = require('ejs')
const { decodeAccessToken } = require('../login-system/token')
const notify = require('../login-system/notification')

require("dotenv").config()
const  db  = require('../config/mysql_connection')

// sending the uloaded files of student to the stakeholders 
const uploadedpapers = async (req, res) => {
    const decodedToken = decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user;
    await db.getConnection(async (err, connection) => {
        if (err) throw err;
        const query = mysql.format("select * from stk_holder where id=?", [userid]);
        await connection.query(query, async (err, result) => {
            if (err) throw err;
            if (result.length != 0) {
                const col_name = result[0].col_name;
                const display = "select up.status,up.sno,info.name,info.email,up.filename,up.filepath,info.col_name from upload_file_db as up inner join info_table as info on up.userid=info.id";
                await connection.query(display, (err, files) => {
                    if (err) throw err;
                    const matchingFiles = files.filter(file => file.col_name === col_name);
                    const fileData = matchingFiles.map(file => ({
                        filename: file.filename,
                        name: file.name,
                        collegename: file.col_name,
                        status: file.status,
                        id: file.sno
                    }));
                    res.status(200).send(fileData);
                });
            }
        });
    });
};

// displaying details during approval to the stakeholder 
const displaydetail = async (req, res) => {
    const decodedToken = decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user;
    const paperid = req.query.id;
    console.log(paperid)
    await db.getConnection(async (err, connection) => {
        if (err) throw err;
        const query = mysql.format("select * from stk_holder where id=?", [userid]);
        await connection.query(query, async (err, result) => {
            if (err) throw err;
            if (result.length != 0) {
                const col_name = result[0].col_name;
                const display = "select up.status,up.sno,info.name,info.email,up.filename,up.filepath,info.col_name from upload_file_db as up inner join info_table as info on up.userid=info.id";
                await connection.query(display, async (err, files) => {
                    if (err) throw err;
                    const matchingFiles = files.filter(file => file.col_name === col_name);
                    const query = "select info.*,u.* from info_table as info inner join upload_file_db as u on info.id=userid where u.sno=?";
                    const searchquery = mysql.format(query, [paperid])
                    await connection.query(searchquery, (err, result) => {
                        if (err) {
                            console.log('internal server error' + err)
                        }
                        if (result != 0) {
                            const filepath = result[0].filepath
                            const filename = result[0].filename
                            const name = result[0].name
                            const email = result[0].email
                            const col_name = result[0].col_name
                            const sno = result[0].sno;
                            res.json({ filepath, filename, name, email, col_name, sno })
                        }
                    })
                });
            }
        });
    });
};

// approval for the research papers 
const approve = async (req, res) => {
    const paperid = req.query.id;
    console.log("paperid ", paperid)
    db.getConnection(async (err, connection) => {
        const approval = "update upload_file_db set status=true where sno=?;"
        const app_query = mysql.format(approval, [paperid]);
        await connection.query(app_query, (err, result) => {
            if (err) {
                console.log("interanl server error" + err)
            }
            if (result) {
                res.sendStatus(201);
                console.log("approved");
                const sub = 'Research Nexas-Approval'
                // const content=`Your Research Paper has been reviewed and approved by the stakeholder on dtd.You can view the status for approval of the paper on uploads page`
                // notify(req,res,email,sub,content);
            }
            else {
                res.send('error during approving')
            }
        })
    })
}

module.exports = { approve, uploadedpapers, displaydetail };
