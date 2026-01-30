const express = require("express");
const router = express.Router();
const upload = require("../../Middleware/cloudinaryStorge");
const auth = require("../../Middleware/authmiddleware");
const { getMyTasks, updateTaskStatus, uploadFiles, addComment, removeUpload } = require("../../Controllers/EmployeeController/TaskController");
const { updateWork } = require("../../Controllers/EmployeeController/TaskUpload");


// Get all tasks for employee
router.get("/my-tasks", auth.verifyToken, auth.checkRole("Sales Executive", "Inventory Manager", "Web Developer", "Software Developer", "HR", "Accountant", "Designer", "Technician"), getMyTasks);

// Update task status
router.put(
  "/:taskId/status",
  auth.verifyToken,
  auth.checkRole("Sales Executive", "Inventory Manager", "Web Developer", "Software Developer", "HR", "Accountant", "Designer", "Technician"),
  updateTaskStatus
);

// Upload Files
router.post(
  "/:taskId/upload",
  auth.verifyToken,
  auth.checkRole("Sales Executive", "Inventory Manager", "Web Developer", "Software Developer", "HR", "Accountant", "Designer", "Technician"),
  upload.array("files"),
  uploadFiles
);

// Add comment
router.post(
  "/:taskId/comment",
  auth.verifyToken,
  auth.checkRole("Sales Executive", "Admin", "Manager", "Inventory Manager", "Web Developer", "Software Developer", "HR", "Accountant", "Designer", "Technician"),
  addComment
);

// Remove upload
router.delete(
  "/:taskId/upload/:uploadId",
  auth.verifyToken,
  auth.checkRole("Sales Executive", "Inventory Manager", "Web Developer", "Software Developer", "HR", "Accountant", "Designer", "Technician"),
  removeUpload
);


module.exports = router;


// //UPDATE FILE
// router.put(
//   "/:taskId/update-work",
//   auth.verifyToken,
//   auth.checkRole(
//     "Sales Executive",
//     "Inventory Manager",
//     "Web Developer",
//     "Software Developer",
//     "HR",
//     "Accountant",
//     "Designer",
//     "Technician"
//   ),
//   upload.array("files"),
//   updateWork
// );