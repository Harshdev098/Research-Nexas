const mysql = require('mysql2/promise');
const path = require('path');
const ejs = require('ejs');
const { decodeAccessToken } = require('../login-system/token');
const notify = require('../login-system/notification');
require("dotenv").config();
const db = require('../config/mysql_connection'); // Ensure this returns a `mysql2/promise` pool instance

// Sending the uploaded files of students to stakeholders
const uploadedpapers = async (req, res) => {
    try {
        console.log("uploaded papers displaying to stk")
        const decodedToken = decodeAccessToken(req.headers.authorization);
        if (!decodedToken || !decodedToken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }

        const userid = decodedToken.user;
        const connection = await db.getConnection();

        try {
            const [result] = await connection.query(
                "SELECT * FROM stk_holder WHERE id = ?", 
                [userid]
            );

            if (result.length === 0) {
                return res.status(404).send('Stakeholder not found');
            }

            const col_name = result[0].col_name;

            const [files] = await connection.query(
                "SELECT up.status, up.sno, info.name, info.email, up.filename, up.filepath, info.col_name " +
                "FROM upload_file_db AS up " +
                "INNER JOIN info_table AS info ON up.userid = info.id"
            );
            console.log(files)
            const matchingFiles = files.filter(file => file.col_name === col_name);

            const fileData = matchingFiles.map(file => ({
                filename: file.filename,
                name: file.name,
                collegename: file.col_name,
                status: file.status,
                id: file.sno,
            }));

            res.status(200).send(fileData);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching uploaded papers:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Displaying details during approval to the stakeholder
const displaydetail = async (req, res) => {
    try {
        const decodedToken = decodeAccessToken(req.headers.authorization);
        if (!decodedToken || !decodedToken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }

        const userid = decodedToken.user;
        const paperid = req.query.id;

        console.log(paperid);

        const connection = await db.getConnection();

        try {
            const [result] = await connection.query(
                "SELECT * FROM stk_holder WHERE id = ?", 
                [userid]
            );

            if (result.length === 0) {
                return res.status(404).send('Stakeholder not found');
            }

            const col_name = result[0].col_name;

            const [files] = await connection.query(
                "SELECT up.status, up.sno, info.name, info.email, up.filename, up.filepath, info.col_name " +
                "FROM upload_file_db AS up " +
                "INNER JOIN info_table AS info ON up.userid = info.id"
            );

            const query = 
                "SELECT info.*, u.* " +
                "FROM info_table AS info " +
                "INNER JOIN upload_file_db AS u ON info.id = u.userid " +
                "WHERE u.sno = ?";
            
            const [fileDetails] = await connection.query(query, [paperid]);

            if (fileDetails.length > 0) {
                const { filepath, filename, name, email, col_name, sno } = fileDetails[0];
                res.json({ filepath, filename, name, email, col_name, sno });
            } else {
                res.status(404).send('File not found');
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error displaying details:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Approval for the research papers
const approve = async (req, res) => {
    try {
        const paperid = req.query.id;
        console.log("paperid ", paperid);

        const connection = await db.getConnection();

        try {
            const approvalQuery = "UPDATE upload_file_db SET status = true WHERE sno = ?";
            const [result] = await connection.query(approvalQuery, [paperid]);

            if (result.affectedRows > 0) {
                res.sendStatus(201);
                console.log("Approved");

                const sub = 'Research Nexas-Approval';
                // const content = `Your Research Paper has been reviewed and approved by the stakeholder on dtd.You can view the status for approval of the paper on uploads page`;
                // notify(req, res, email, sub, content);
            } else {
                res.status(400).send('Error during approval');
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error approving paper:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { approve, uploadedpapers, displaydetail };
