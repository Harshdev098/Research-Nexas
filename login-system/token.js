require("dotenv").config()
const jwt = require("jsonwebtoken")
const crypto=require('crypto');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET

// check for valid access token 
if(!ACCESS_TOKEN){
    throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables.");
}
// function for generating access token
function generateAccessToken(user,expireTime = "20m") {
   try{
    const token = jwt.sign(user,ACCESS_TOKEN,{expiresIn : expireTime});
    return token;
   }catch(err){
        console.log({
            Message : "Error While Generating The Token",
            Error : err.message
        })
        return null;
   }
}

// function for decoding the token 
function decodeAccessToken(AuthHeader){
        if(!AuthHeader){
            console.log("Authorization header is missing");
            return null;
        }

        const token = AuthHeader.split(" ")[1];
        if(!token){
            console.log("Token is missing");
            return null;
        }
    try{

        const decodedToken = jwt.verify(token,ACCESS_TOKEN)
        return decodedToken;
        
     }catch(err){
        console.log({
           Message : "Error decoding access token:",
           Error : err.message
        })
        return null
    }
}

// generating registration token for faculties 
function registrationToken(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
  }

module.exports={ generateAccessToken, decodeAccessToken ,registrationToken}
