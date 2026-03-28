const  mongoose  = require("mongoose")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    otpHash: {
        type: String,
        required: [true, "OTP is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
},{timestamps: true})

const otpModel = mongoose.model("otps",otpSchema);
module.exports = otpModel;