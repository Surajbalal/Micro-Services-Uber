const userModel = require("../models/user.models");
const blackListModel = require("../models/blackListToken.model");
const { validationResult } = require("express-validator");
const { createUser } = require("../services/user.service");
const { response } = require("../app");

module.exports.registerUser = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullName, email, password } = req.body;

  const isUserAlready = await userModel.findOne({email});

  if(isUserAlready){
    return res.status(400).json({message:"User already exist"})
 f }

  const hashPassword = await userModel.hashPassword(password);

  const user = await createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashPassword,
  });
  const token = user.genrateToken();
  return res.status(201).json({ token, user });
};
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = user.genrateToken();
  res.cookie("token", token);
  return res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.set('Cache-Control', 'no-store');
// res.status(200).json(user);

  return res.status(200).json(req.user);
};
module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blackListModel.create({token});
  res.status(200).json({ message: "Logout successfully" });
}
