const mongoose = require("mongoose");
const User = require("../models/user.model");
const Outbox = require("../models/outbox.model");
const sessionModel = require("../models/session.model");
const otpModel = require("../models/otp.model");

module.exports.createUser = async ({ email, password, role, firstName, lastName }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Array creation with session returns an array of created docs
    const [user] = await User.create([{
      email,
      password,
      role
    }], { session });

    await Outbox.create([{
      eventType: "USER_CREATED",
      // Include a unique eventId to help the consumer with idempotency
      payload: {
        eventId: new mongoose.Types.ObjectId(), 
        userId: user._id,
        email: user.email,
        role: user.role,
        firstName,
        lastName
      }
    }], { session });

    await session.commitTransaction();
    return user;

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};
module.exports.createSession = async ({user,refreshTokenHash,ip,userAgent}) =>{
  if(!user || !refreshTokenHash || !ip || !userAgent){
    throw new Error("Missing required fields for session creation")
  }
  const session = await sessionModel.create({
    user:user._id,
    refreshTokenHash,
    ip,
    userAgent
  });
  return session
}
module.exports.createOtp = async ({email,otpHash,user}) =>{
  console.log("asdasdvcasdvasdvasdvasdv")
  if(!email || !otpHash || !user){
    throw new Error("Missing required fields for otp creation")
  }
  const otp = await otpModel.create({
    email,
    otpHash,
    user
  });
  console.log("asdasdvcasdvasdvasdvasdv. ENDDD!!!")
  return otp
}