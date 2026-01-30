const Employee = require("../models/CreateEmployee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailOption = require("../Confige/mailconfig");

exports.UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Check user exists
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        department: user.department, // optional (if needed)
      },
      process.env.JWT_SECRET || "MY_SECRET_KEY_2025",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: `${user.role} login successful`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });

  } catch (err) {
    console.log("Login Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ----------------------- Send OTP ---------------------------//

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({
        success: false,
        message: 'Please Fill All fields',
      });
    }

    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found',
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    // Save to DB (correct field names)
    user.resetOtp = hashedOtp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min expiry

    await user.save();

    // Send OTP via email
    mailOption(email, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP Sent Successfully',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error - SendOtp API',
    });
  }
};


// ------------------- Verify OTP -------------------------//

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(401).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check expiry
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Compare OTP
    const match = await bcrypt.compare(String(otp), String(user.resetOtp));
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.OtpVerify = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully!",
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error - VerifyOTP API",
      error: error.message,
    });
  }
};


// ------------------- Change Password ------------------//

exports.changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 🔒 IMPORTANT: Check if OTP was verified
    if (!user.OtpVerify) {
      return res.status(400).json({
        success: false,
        message: "OTP verification required before password change",
      });
    }

    // Hash new password
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;

    // Reset OTP-related fields
    user.resetOtp = null;
    user.otpExpire = null;   // FIXED
    user.OtpVerify = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error - changePassword API",
    });
  }
};

