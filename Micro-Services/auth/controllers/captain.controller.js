const captainModel = require("../models/captain.model");
const blackListModel = require("../models/blackListToken.model");
const { validationResult } = require("express-validator");
const { createCaptain } = require("../services/captain.service");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, vehicle } = req.body;

  const isCaptainAlready = await captainModel.findOne({ email });

  if (isCaptainAlready) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  const hashPassword = await captainModel.hashPassword(password);

  const captain = await createCaptain({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashPassword,
    role: "captain",
    vehicle
  });

  const token = captain.genrateAcessToken(true);
  return res.status(201).json({ token, captain });
};

module.exports.captainLogin = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.genrateAcessToken();
  res.cookie("token", token);
  
  return res.status(200).json({ token, captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blackListModel.create({ token });
  res.status(200).json({ message: "Logout successfully" });
};
