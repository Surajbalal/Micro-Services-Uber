// const cookie = require('cookie-parser');
// const captainModel = require('../models/captain.model');
const jwt = require('jsonwebtoken');
// const blackListTokenModel = require('../models/blackListToken.model');
const { publishToQueue } = require('../services/rabbit');
module.exports.authCaptain = async(req, res, next) =>{
    try {
        console.log(req)
        console.log("first")
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
        console.log(`token : ${token}`);
       

        if(!token){
            console.log("inside token check")
            return res.status(401).json({message:"Unauthorized"});
        }

        
        // const isBlackList = await blackListTokenModel.findOne({token});
        const isBlackList =  await publishToQueue("isBlackList-captain",{token})
        if(isBlackList){
            
            console.log(isBlackList,"indside auth user");
            return res.status(401).json({message:"Unauthorized"});
        }
        console.log("dcvsdfvsdfvsdfvsdfvsdfvsdvdsfv")

        const decode  =  jwt.verify(token,process.env.JWT_SECRET);
        if (decode.role !== 'captain') {
            console.log("inside role check")
             return res.status(401).json({message:"Unauthorized"});
        }
        
        // const captain = await captainModel.findById(decode._id);
        const captain = await publishToQueue("get-captain",{_id:decode._id})
        console.log(captain,"this is functionality check");
        if(!captain){
          
             return res.status(401).json({message:"Unauthorized"});
        }

        req.captain = captain;

        next();

    } catch (error) {
        return res.status(401).json({message:"Unauthorized"});
    }
}