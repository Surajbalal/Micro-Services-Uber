const { validationResult } = require("express-validator");
const captainModel = require("../models/captain.model");

const captainService = require('../services/captain.service');
const { error } = require("console");
const blackListTokenModel = require("../models/blackListToken.model");
module.exports.registerCaptain = async(req, res, next)=>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {fullName, email, password, vehicle} = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({email});

    if(isCaptainAlreadyExist){
        return res.status(400).json({message:'Captain already exist'})
    }

    const hashPassword = await captainModel.hashPassword(password);
    const captain = await captainService.createCaptain({
        'firstName': fullName.firstName,
        'lastName': fullName.lastName,
        email,
        'password': hashPassword,
        'color': vehicle.color,
        'plate': vehicle.plate,
        'capacity': vehicle.capacity,
        'vehicleType': vehicle.vehicleType
    })
    const token = captain.genrateToken();
    res.status(201).json({token,captain});
}
module.exports.captainLogin = async(req, res, next)=>{
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors})
    }
    const {email, password} = req.body;
  

    const captain = await captainModel.findOne({email}).select('+password');
   
    if(!captain){
        return res.status(401).json({message:"Invalid emial or password"});
    }

    const verifyPassword = await captain.comparePassword(password);

    if(!verifyPassword){
        return res.status(401).json({message:"Invalid emial or password"});
    }

    const token = captain.genrateToken();


    res.cookie(token);

    res.status(200).json({token,captain});
}
module.exports.getProfile = async(req, res, next)=>{

    res.status(200).json({captain:req.captain});
}
module.exports.logoutCaptain = async(req,res,next) =>{
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    
      await  blackListTokenModel.create({ token })

      res.status(200).json({message:"logout successfully"});
}
module.exports.updateCaptain = async(req,res)=>{
    
}