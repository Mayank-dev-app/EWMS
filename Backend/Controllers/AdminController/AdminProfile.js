const mailOption = require("../../Confige/mailconfig");
const AdminProfile = require("../../models/CreateEmployee");
const bcrypt = require("bcrypt");

const AdminProfileData = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // 1. Validate fields
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all details",
      });
    }

    // 2. Check if email already exists
    const existingAdmin = await AdminProfile.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create admin
    const admin = await AdminProfile.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    // 5. Return success
    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin,
    });

  } catch (error) {
    console.error("Admin Create Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in AdminData Controller",
    });
  }
};


const GetAdminData = async (req, res) => {
  try {
    const admin = await AdminProfile.find();

    if (!admin || admin.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No admin found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin data fetched successfully",
      admin,
    });

  } catch (error) {
    console.error("Get Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getting admin data",
    });
  }
};

const UpdateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, role } = req.body;

    // Check admin exists or not
    const adminExist = await AdminProfile.findById(id);
    if (!adminExist) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Check if email is already used by another admin
    const emailExists = await AdminProfile.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another admin",
      });
    }

    let hashedPassword = adminExist.password;

    // Only hash if new password provided
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await AdminProfile.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        role,
        password: hashedPassword,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });

  } catch (error) {
    console.error("Update Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating admin profile",
    });
  }
};

// OTP store karne ke liye (TEMP memory)
let adminOtpStore = {};

const SendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required!"
      });
    }

    // Random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP with expiry (5 mins)
    adminOtpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    mailOption(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });

  } catch (error) {
    console.log("Send OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
};

const VerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!adminOtpStore[email]) {
      return res.status(400).json({
        success: false,
        message: "OTP not requested for this email!",
      });
    }

    const storedOtp = adminOtpStore[email];

    // OTP Expired Check
    if (Date.now() > storedOtp.expiresAt) {
      delete adminOtpStore[email];

      return res.status(400).json({
        success: false,
        message: "OTP expired!",
      });
    }

    // OTP Match Check
    if (parseInt(otp) !== storedOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    // Successfully verified
    delete adminOtpStore[email];

    return res.status(200).json({
      success: true,
      message: "OTP Verified Successfully!",
    });

  } catch (error) {
    console.log("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed!"
    });
  }
};


module.exports = {
  AdminProfileData,
  GetAdminData,
  UpdateAdminProfile,
  SendOtp,
  VerifyOtp,
};
