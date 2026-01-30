const express = require("express");
const { 
  getDepartments, 
  getDepartmentById 
} = require("../../Controllers/AdminController/AdminDepartment");

const { 
  upload, 
  addDepartment 
} = require("../../Controllers/AdminController/CreateDepartment");

const { 
  updateDepartment 
} = require("../../Controllers/AdminController/EditDepartment");
const { verifyToken, checkRole } = require("../../Middleware/authmiddleware");



const router = express.Router();


// ====================== ADMIN PROTECTED ROUTES ======================

// Get all departments
router.get(
  "/departments",
  verifyToken,
  checkRole("Admin"),
  getDepartments
);

// Get department by ID
router.get(
  "/department/:id",
  verifyToken,
  checkRole("Admin"),
  getDepartmentById
);

// Create department
router.post(
  "/department/create",
  verifyToken,
  checkRole("Admin"),
  upload.single("icon"),
  addDepartment
);

// Update department
router.put(
  "/department/update/:id",
  verifyToken,
  checkRole("Admin"),
  upload.single("icon"),
  updateDepartment
);

module.exports = router;
