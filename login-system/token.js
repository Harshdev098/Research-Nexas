require("dotenv").config()
// generating the token for user
const jwt = require("jsonwebtoken")
const crypto=require('crypto')
function generateAccessToken (user) {
return  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "20m"})
}

// function for decoding the token 
function decodeAccessToken(authorizationHeader) {
    if (!authorizationHeader) {
        console.log('authorization header is missing')
        return null;
    }

    const token = authorizationHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log('decoded info: ',decoded)
        return decoded;
    } catch (error) {
        console.error('Error decoding access token:', error);
        return null;
    }
}

// generating registration token for faculties 
function registrationToken(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
  }

module.exports={ generateAccessToken, decodeAccessToken ,registrationToken}