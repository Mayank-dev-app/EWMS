const express = require("express");
const { upload, AddEmployeeController } = require("../../Controllers/AdminController/CreateEmployee");
const { 
    GetAllEmployees, 
    getEmployeeById, 
    updateEmployee 
} = require("../../Controllers/AdminController/ShowEmployee");

const { ManagerListController } = require("../../Controllers/AdminController/AdminManager");

// Auth Middleware (Role-based)
const { verifyToken, verifyAdmin } = require("../../Middleware/authmiddleware");

const Router = express.Router();

// ---------------- Admin → Employee CRUD ----------------

// Add New Employee  (Only Admin)
Router.post("/add", verifyToken, verifyAdmin, upload.single("image"), AddEmployeeController);

// Get All Employees (Admin + Manager can access)
Router.get("/employees-list", verifyToken, GetAllEmployees);

// Get Employee By ID  (Admin only)
Router.get("/employee/:id", verifyToken, verifyAdmin, getEmployeeById);

// Update Employee (Admin only)
Router.put("/employee/edit/:id", verifyToken, verifyAdmin, updateEmployee);

// ---------------- Manager List ----------------
Router.get("/managers/list", verifyToken, verifyAdmin, ManagerListController);

module.exports = Router;
