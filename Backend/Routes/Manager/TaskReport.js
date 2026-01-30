const express = require("express");
const router = express.Router();

const { getTaskReports } = require("../../Controllers/ManagerController/TaskReportController");
const { verifyManager, verifyToken } = require("../../Middleware/authmiddleware");

router.get("/task-reports", verifyToken, verifyManager, getTaskReports);

module.exports = router;
