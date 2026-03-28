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
          console.log("inside blacklist check")
            return res.status(401).json({message:"Unauthorized"});
        }

        const decode  =  jwt.verify(token,process.env.JWT_SECRET);
        if (decode.role !== 'captain') {
                      console.log("inside role check")
            return res.status(401).json({message:"Unauthorized"});
        }
        
        const captain = await captainModel.findById(decode._id);

        if(!captain){
            console.log("inside user check")
            if (decode.isNewUser === true) {
                // Return 202 Accepted as the profile is pending sync via RabbitMQ
                res.setHeader('Retry-After', '1');
                return res.status(202).json({
                    status: "pending",
                    message: "Profile is being created. Please retry shortly."
                });
            } else {
                // If isNewUser is false or missing, user isn't pending sync
                return res.status(404).json({ message: "User not found" });
            }
        }

        req.captain = captain;

        next();

    } catch (error) {
        return res.status(401).json({message:"Unauthorized"});
    }
}