const express = require('express')
const mysql = require('mysql')
const path = require('path')
const bcrypt = require('bcrypt')
const { upload, save, disp } = require(path.resolve(__dirname, '../file_upload/upload.js'));
const info = require('../file_upload/form_db')
const { signup, signin } = require('./login');
const app = express()

// serving pages 
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
})
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
})
app.get('/main_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/main_page.html'));
})
app.get('/upload_file.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/upload_file.html'));
})
app.get('/form_filling.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/form_filling.html'));
})

app.use(express.json())

// uploading files 
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        console.error('File upload failed');
        return res.status(500).send('File upload failed');
    }
    try {
        console.log('File uploaded successfully:', req.file.filename);
        await save(req, res);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error during upload:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// uploading user information to database
app.post('/info', info);

// serving upload research papers 
app.get('/uploaded_files', disp)

// creating user
app.post("/create_user",signup)

// login backend 
app.post("/login",signin)

// starting the app on port 
const port = process.env.PORT
app.listen(port,
    () => console.log(`Server Started on port http://localhost:${port}`))