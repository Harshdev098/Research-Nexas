const multer = require('multer')
const path = require('path')
const destination = path.resolve(__dirname, 'uploads/');
const {decodeAccessToken}=require('../login-system/token')
const mysql = require('mysql')

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'user',
    password: 'Ha@96168737',
    database: 'user_DB',
    port: '3306'
 })

// uploading file 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage });

const save = async (req,res) => {
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user;
    const filename = req.file.filename;
    const filepath = req.file.path;
    db.getConnection((err, connection) => {
        if (err) throw err;
        const sql = "INSERT INTO upload_file_db VALUES(?,?,?)"
        const query = mysql.format(sql, [userid, filename, filepath])
        connection.query(query, (err, result) => {
            connection.release();
            if (err) {
                console.error('Error inserting file into database:', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Data Saved');
        });
    })
}
const disp = (req, res) => {
    try {
        const decodedToken = decodeAccessToken(req.headers.authorization);
        if (!decodedToken || !decodedToken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }
        const userid = decodedToken.user;
        const sqlquery = "SELECT * FROM upload_file_db WHERE userid=?";
        const query = mysql.format(sqlquery, [userid]);
        db.query(query, (err, file) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.json({ file });
        });
    } catch (error) {
        console.error('Error during disp:', error);
        res.status(500).send('Internal Server Error');
    }
};

// exporting upload
module.exports = { upload, save, disp };