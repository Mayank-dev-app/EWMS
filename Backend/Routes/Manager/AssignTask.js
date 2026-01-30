const express = require("express");
const router = express.Router();

const {
  getDepartments,
  GetEmployee,
  assignTask,
  getTasks,
  getTaskDetails,
  updateTask,
  deleteTask
} = require("../../Controllers/ManagerController/AssignTask");

const {
  getDepartmentTaskSummary,
  getTasksByDepartment
} = require("../../Controllers/ManagerController/DeptByTask");

const {
  submitTaskForApproval,
  getApprovalTasks,
  approveTask,
} = require("../../Controllers/ManagerController/TaskApprovel");

const upload = require("../../Middleware/cloudinaryStorge");
const { verifyToken, checkRole } = require("../../Middleware/authmiddleware");

// ===================== Manager Routes =====================

router.get("/get-department", verifyToken, checkRole("Manager"), getDepartments);
router.get("/by-department/:dept", verifyToken, checkRole("Manager"), GetEmployee);
router.post("/assign-task", verifyToken, checkRole("Manager"), assignTask);
router.get("/tasks", verifyToken, checkRole("Manager"), getTasks);
router.get("/tasks/:id", verifyToken, checkRole("Manager"), getTaskDetails);
router.put("/task/:id", verifyToken, checkRole("Manager"), updateTask);
router.delete("/task/:id", verifyToken, checkRole("Manager"), deleteTask);
router.get("/department-task-summary", verifyToken, checkRole("Manager"), getDepartmentTaskSummary);
router.get("/tasks-by-department/:dept", verifyToken, checkRole("Manager"), getTasksByDepartment);

// ===================== 🔥 Approval System =====================

// Employee submits task
router.post(
  "/task/submit/:taskId",
  verifyToken,
  checkRole("Employee"),
  upload.array("files", 5),
  submitTaskForApproval
);

// Manager sees approval list
router.get(
  "/task/approval-list",
  verifyToken,
  checkRole("Manager"),
  getApprovalTasks
);

// Manager approves / rejects
router.put(
  "/task/approve/:taskId",
  verifyToken,
  checkRole("Manager"),
  approveTask
);

module.exports = router;
