require("dotenv").config();
const requiredEnv = [
  "PORT",
  "RAZORPAY_API_KEY",
  "RAZORPAY_SECRET_KEY"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is not defined`);
  }
});
const config = {
  PORT: process.env.PORT,
  RAZORPAY_SECREAT_KEY: process.env.RAZORPAY_SECREAT_KEY,
  RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
};
module.exports = config;
