const multer = require('multer')
const path = require('path')
const notify=require('../login-system/notification')
const destination = path.resolve(__dirname, 'uploads/');
const {decodeAccessToken}=require('../login-system/token')
const mysql = require('mysql')


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

// saving the file data in the database 
const save = async (req,res) => {
    const decodedToken = await decodeAccessToken(req.headers.authorization);
    if (!decodedToken || !decodedToken.user) {
        console.error('Invalid or missing user information in the token');
        return res.status(401).send('Unauthorized');
    }
    const userid = decodedToken.user;
    const filename = req.file.filename;
    const filepath = req.file.path;
    db.getConnection(async(err, connection) => {
        if (err) throw err;
        const sql = "INSERT INTO upload_file_db VALUES(0,?,?,?,0,null)"
        const query = mysql.format(sql, [userid, filename, filepath])
        await connection.query(query,async (err, result) => {
            connection.release();
            if (err) {
                console.error('Error inserting file into database:', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Data Saved');
            // const sub='Research Paper Uploaded'
            // const content=`Your Research Paper ${result[0].filename} has been uploaded with username ${result[0].username}`
            // notify(req,res,result[0].email,sub,content);
        });
    })
}

// displaying uploaded research papers to the client whom it belongs 
const disp = (req, res) => {
    try {
        const decodedToken = decodeAccessToken(req.headers.authorization);
        if (!decodedToken || !decodedToken.user) {
            console.error('Invalid or missing user information in the token');
            return res.status(401).send('Unauthorized');
        }
        const userid = decodedToken.user;
        const sqlquery = "SELECT filename FROM upload_file_db WHERE userid=?";
        const query = mysql.format(sqlquery, [userid]);
        db.query(query, (err, result) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Internal Server Error');
            }
            const filenames = result.map(row => row.filename);
            const filepaths=result.map(row => row.filename);
            // console.log(filenames,filepaths);
            res.json({ filenames,filepaths });
        });
    } catch (error) {
        console.error('Error during disp:', error);
        res.status(500).send('Internal Server Error');
    }
};

// exporting upload
module.exports = { upload, save, disp };