const { cookie } = require("express-validator");

const jwt = require('jsonwebtoken');
const { publishToQueue } = require("../services/rabbit");

module.exports.authUser = async (req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log("Token: ",token);
    if(!token){
        return res.status(401).json({message:"Unauthorized access"})
    }
    // const isBlackListed = await blackListModel.findOne({token})
    console.log("inside auth user")
    const isBlackListed = await publishToQueue('isBlackList-user',{token})
    console.log(isBlackListed,"sdfsdf")
    
    if(isBlackListed){
        return res.status(401).json({message:"Unauthorised"});
    }
    try {
        const decode =  jwt.verify(token,process.env.JWT_SECRET);
        // const user =await userModel.findById(decode._id);
        const user =await publishToQueue('get-user',{_id: decode._id});
        
        req.user = user

        return next()
    
    } catch (error) {
         return res.status(401).json({message:"Unauthorized access"})
    
    }
}