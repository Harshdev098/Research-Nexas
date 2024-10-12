require("dotenv").config()
const jwt = require("jsonwebtoken")
const crypto=require('crypto');
const { error } = require("console");

// Middleware to validate environment variables and pass it in req.Key 
function checkKey(req,res,next){
    const Key = process.env.ACCESS_TOKEN_SECRET
    if(!Key){
        return res.status(500).json({Error : 'Missing ACCESS_TOKEN_SECRET in environment variables.'}); 
    }else{
        req.Key = Key;
        next();
    }
}

// function for generating access token with req and res
function generateAccessToken(req,res,user,expireTime = "20m") {
    const Key = req.Key
   try{
        const token = jwt.sign(user,Key,{
            expiresIn : expireTime
        })
        if(!token){
            return res.status(500).json({ message: "Token generation failed" });
        }
        return res.status(200).json({token})
   }catch(err){
        return res.status(500).json(
            {
                Message : "Server Error During Token Generation" ,
                Error : err.message
            }
        );
   }
}

// function for decoding the token with req and res
function decodeAccessToken(req,res){
    const Key = req.Key
    const AuthHeader = req.headers.authorization
    try{
        if(!AuthHeader){
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        const token = AuthHeader.split(" ")[1];

        const decodedToken = jwt.verify(token,Key)
        if(!decodedToken){
            return res.status(400).json({message : "Unable to decode token"})
        }
        return res.status(200).json({decodedToken})
        
     }catch(err){
        res.status(500).json({
            message : "Invalid or Expired token",
            error : err.message
        })
    }
}

// generating registration token for faculties 
function registrationToken(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
  }

module.exports={ generateAccessToken, decodeAccessToken ,registrationToken}
