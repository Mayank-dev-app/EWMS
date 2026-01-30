const express = require("express");
const { UserLogin, sendOtp, verifyOtp, changePassword } = require("../Controllers/LoginController");

const Router = express.Router();

Router.post("/login", UserLogin);
Router.post("/send-otp", sendOtp );
Router.post("/verify-otp", verifyOtp);
Router.post("/change-password", changePassword);

module.exports = Router;