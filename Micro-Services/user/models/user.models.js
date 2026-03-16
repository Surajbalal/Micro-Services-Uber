const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      require: true,
      minlength: [4, "First name must be at leat 4 characters long"],
    },
    lastName: {
      type: String,
      minlength: [4, "Last name must be atleat 4 charactersn long"],
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});
userSchema.methods.genrateToken = function () {
  const token = jwt.sign({ _id: this.id, role: 'user' }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
