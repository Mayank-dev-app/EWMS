const express = require("express");
const { getAllTasks } = require("../../Controllers/AdminController/AdminTask");
const { verifyToken, checkRole } = require("../../Middleware/authmiddleware");

const router = express.Router();

// All tasks created by manager
router.get("/tasks", verifyToken, checkRole("Admin"), getAllTasks);

module.exports = router;