const userModel = require("../models/user.model");
const crypto = require("crypto"); 
const blackListModel = require("../models/blackListToken.model");
const { validationResult } = require("express-validator");
const userService= require("../services/user.service");
const emailService = require("../services/email.service");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const sessionModel = require("../models/session.model");
const { generateOtp, getOtpHtml } = require("../utils/util");
const otpModel = require("../models/otp.model");
module.exports.registerUser = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullName, email, password } = req.body;

  const isUserAlready = await userModel.findOne({email});

  if(isUserAlready){
    return res.status(400).json({message:"User already exist"})
  }

  const hashPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashPassword,
    role:"user"
  });

  const otp = generateOtp();
  const html = getOtpHtml(otp);
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  await userService.createOtp({
    email,
    otpHash,
    user: user._id
  })

  await emailService.sendEmail(email,"OTP Verification",`Your OTP code is ${otp}`,html);
  //   const refreshToken = user.genrateRefreshToken();
  // res.cookie("refreshToken", refreshToken,{
  //   httpOnly:true,
  //   secure: true,
  //   sameSite:"strict",
  //   maxAge: 7*24*60*60*1000
    
  // });


  // const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  //   const session =await userService.createSession({
  //     user: user._id,
  //     refreshTokenHash,
  //     ip: req.ip,
  //     userAgent: req.headers['user-agent']
    
  //   })
  //     const token = user.genrateAcessToken(true,session._id);


  return res.status(201).json({ user});
};
module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if(!user.verified){
    return res.status(401).json({message: "Email not verified"})
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
 
  const refreshToken = user.genrateRefreshToken();

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const session = await userService.createSession({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers['user-agent']
    
    
  })

  const token = user.genrateAcessToken({sessionId: session._id});
  res.cookie("refreshToken", refreshToken,{
    httpOnly:true,
    secure: true,
    sameSite:"strict",
    maxAge: 7*24*60*60*1000
    
  });
  return res.status(200).json({ token, user });
};

module.exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(401).json({message:"Refresh token not found"})
  }
  const decoded = jwt.verify(refreshToken,config.JWT_REFRESH_TOKEN_SECRET)

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoke:false
  })
  
  if(!session){
    return res.status(401).json({message:"Invalid refresh token"})
  }

  const user = await userModel.findById(decoded._id);

  if(!user){
    return res.status(401).json({message:"Invalid refresh token"})
  }

  token = user.genrateAcessToken();
  const newRefreshToken = user.genrateRefreshToken();
  const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();  
  res.cookie("refreshToken", newRefreshToken,{
    httpOnly:true,
    secure: true,
    sameSite:"strict",
    maxAge: 7*24*60*60*1000
    
  });
  res.status(200).json({
    message: "Access token refresh successfully",
    token
  })
  

};
module.exports.logoutUser = async (req, res) => {
  // res.clearCookie("token");
  // const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(400).json({message: "Refresh token not found"})
  }

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoke: false
  })

if(!session){
   return res.status(400).json({message: "Invalid refresh token "})
}

  // await blackListModel.create({token});
  session.revoke = true;
 await session.save(); 
 res.clearCookie("refreshToken");


  res.status(200).json({ message: "Logout successfully" });
}
module.exports.logoutAllUser = async (req, res) =>{

  const refreshToken = req.cookie.refreshToken;

  if(!refreshToken){
    return res.status(400).json({message: "Refresh token not found"})
  }

  const decoded = jwt.verify(refreshToken,config.JWT_REFRESH_TOKEN_SECRET);

  await sessionModel.updateMany({
    user: decoded._id,
    revoke: false
  },{revoke: true})

  res.clearCookie('refreshToken');

  return res.status(200).json({message: "Logout from all devices successfully"});

}
module.exports.verifyEmail = async (req, res) =>{
  const {otp, email} = req.body;

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDoc = await otpModel.findOne({
    email,
    otpHash
  }) 

  const user = await userModel.findByIdAndUpdate(otpDoc.user,{
    verified: true
  })

  await otpModel.deleteMany({
    user: otpDoc.user
  });

  const refreshToken = user.genrateRefreshToken();
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  
  const session = await userService.createSession({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers['user-agent']
    
    
  })
  const token = user.genrateAcessToken({isNewUser: true,sessionId: session._id});

  res.cookie("refreshToken",refreshToken,{
    hhtpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7*24*60*60*1000
  })

  return res.status(200).json({message: "Email verified successfully",token,
  user
  }
  )

}