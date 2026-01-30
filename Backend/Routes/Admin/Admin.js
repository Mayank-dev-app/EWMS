const express = require("express");

const {
    AdminProfileData,
    GetAdminData,
    UpdateAdminProfile,
    SendOtp,
    VerifyOtp
} = require("../../Controllers/AdminController/AdminProfile");

const { AdminDashboardCounts } = require("../../Controllers/AdminController/AdminDashboardCount");

const { verifyToken , checkRole } = require("../../Middleware/authmiddleware");

const router = express.Router();


// ==================== PUBLIC ROUTES (No Login Required) ====================

// Test Route
router.get("/test", (req, res) => {
    res.send("This is a Test Route.");
});

// Create admin (only first-time).
router.post("/create", AdminProfileData);

// Send OTP
router.post("/send-otp", SendOtp);

// OTP Verify
router.post("/verify-otp", VerifyOtp);


// ==================== PROTECTED ROUTES (Admin Login Required) ====================

// Get admin profile
router.get(
    "/get",
    verifyToken,
    checkRole("Admin"),
    GetAdminData
);

// Update admin profile
router.put(
    "/update-admin/:id",
    verifyToken,
    checkRole("Admin"),
    UpdateAdminProfile
);

// Dashboard calculation API
router.get(
    "/dashboard-counts",
    verifyToken,
    checkRole("Admin"),
    AdminDashboardCounts
);


module.exports = router;
