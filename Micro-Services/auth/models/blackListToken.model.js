const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  role: {
    type: String,
    enum: ["user", "captain"],
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("UserBlackListToken", blackListTokenSchema);
