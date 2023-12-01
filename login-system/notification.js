const express = require('express');
const mailgun = require('mailgun-js');

const app = express();
const PORT = 3000;
app.use(express.json());

const mg = mailgun({
    apiKey: 'YOUR_MAILGUN_API_KEY',
    domain: 'YOUR_MAILGUN_DOMAIN',
});

const notify= (req, res,recipient) => {
    const data = {
        from: 'harshoxfordgkp@gmail.com',
        to: recipient,
        subject:'Research Nexas Signup',
        text:'jskjkfsjkfjskdfskdlfkjdsnnjksdfkjdsnfkjsdkfjkdsjknsjskfdkndjfsdkkds'
    };

    mg.messages().send(data, (error, body) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error during sending email');
        }
        console.log(body);
        res.send('Email sent successfully');
    });
};

module.exports=notify;