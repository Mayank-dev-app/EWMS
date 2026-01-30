const express = require("express");
const {
  getDashboardSummary,
  getEmployeePerformance,
} = require("../../Controllers/ManagerController/FetchTaskEmpDept");

const router = express.Router();

// Manager Dashboard Summary
router.get("/dashboard-summary", getDashboardSummary);

// Employee Performance
router.get("/employee-performance", getEmployeePerformance);

module.exports = router;
