const mongoose = require("mongoose");
const Captain = require("../models/captain.model");
const Outbox = require("../models/outbox.model");

module.exports.createCaptain = async ({ email, password, role, firstName, lastName, vehicle }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [captain] = await Captain.create([{
      email,
      password,
      role: role || "captain"
    }], { session });

    await Outbox.create([{
      eventType: "CAPTAIN_CREATED",
      payload: {
        eventId: new mongoose.Types.ObjectId(), 
        captainId: captain._id,
        email: captain.email,
        role: captain.role,
        firstName,
        lastName,
        vehicle
      }
    }], { session });

    await session.commitTransaction();
    return captain;

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};
