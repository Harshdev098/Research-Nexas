const nodemailer=require('nodemailer')

require("dotenv").config()
const MYEMAIL=process.env.EMAIL;
const PASS=process.env.MYPASS
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MYEMAIL,
        pass: PASS,
    },
});

const notify=(req,res,email,sub,content)=>{
    const mailOptions = {
        from: MYEMAIL,
        to: `${email}`,
        subject: `${sub}`,
        text: `${content}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending notification email:', error);
        } else {
            console.log('Notification email sent:', info.response);
        }
    });
}

module.exports = notify;