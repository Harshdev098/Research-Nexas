const express = require('express')
const path = require('path')
const { upload, save, disp } = require(path.resolve(__dirname, '../file_upload/upload.js'));
const {stk_signup,stk_signin}=require('../stakeholder/login')
const {info,check} = require('../file_upload/form_db')
const { signup, signin } = require('./login');
const { approve,uploadedpapers,displaydetail }= require('../stakeholder/stk_approval')
const {display}=require('../backend/profile');
const { setcriteria } = require('../stakeholder/evaluation');
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
app.get('/stk_signup.html',(req,res)=>{
    res.sendFile(path.join(__dirname, '../public/stk_signup.html'));
})
app.get('/form_filling',async (req,res)=>{
    await check(req,res)
})
app.get('/dashboard',async(req,res)=>{
    await display(req,res);
})


app.use(express.json())
app.use(express.static('../file_upload/uploads'))

// serving ejs files
app.set('views', path.join(__dirname, '../views'));
app.set('view engine','ejs') 
app.get('/stk_papers',async(req,res)=>{
    res.render('stk_papers')
})
app.get('/api/stk_papers',uploadedpapers)
app.get('/api/papers_detail',displaydetail)


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
app.post("/stk_holder_signup",stk_signup)

// login backend 
app.post("/login",signin)
app.post("/stk_holder_signin",stk_signin)

// approval by stakeholder
app.get('/approval',approve)

// setting evaluation criteria 
app.post('/evaluation',setcriteria)

// starting the app on port 
const port = process.env.PORT
app.listen(port,
    () => console.log(`Server Started on port http://localhost:${port}`))