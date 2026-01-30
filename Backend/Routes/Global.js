const express = require("express");
const router = express.Router();

const { checkRole, verifyToken } = require("../Middleware/authmiddleware");
const { getDepartments } = require("../Controllers/AdminController/AdminDepartment");
const { GetAllEmployees, FilterEmployees } = require("../Controllers/AdminController/ShowEmployee");


//Show Department List
router.get(
    "/departments",
    verifyToken,
    checkRole("Admin", "Manager", "Sales Executive", "Inventory Manager", "Web Developer", "Software Developer", "HR", "Accountant", "Designer", "Technician"),
    getDepartments,
)

//Show Employee List

router.get(
    "/employees",
    verifyToken,
    checkRole("Admin", "Manager", "Sales Executive", "Inventory Manager", "Web Developer", "Software Developer", "HR", "Accountant", "Designer", "Technician"),
    FilterEmployees,
)
module.exports = router;