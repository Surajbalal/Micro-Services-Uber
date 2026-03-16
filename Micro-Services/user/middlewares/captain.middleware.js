// const cookie = require('cookie-parser');
const captainModel = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');
module.exports.authCaptain = async(req, res, next) =>{
    try {
        console.log(req)
        console.log("first")
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        console.log(`token : ${token}`);
       

        if(!token){
            console.log("inside token check")
            return res.status(401).json({message:"Unauthorized"});
        }

        
        const isBlackList = await blackListTokenModel.findOne({token});
        
        if(isBlackList){

            return res.status(401).json({message:"Unauthorized"});
        }

        const decode  =  jwt.verify(token,process.env.JWT_SECRET);
        if (decode.role !== 'captain') {
            return res.status(401).json({message:"Unauthorized"});
        }
        
        const captain = await captainModel.findById(decode._id);

        if(!captain){
          
             return res.status(401).json({message:"Unauthorized"});
        }

        req.captain = captain;

        next();

    } catch (error) {
        return res.status(401).json({message:"Unauthorized"});
    }
}