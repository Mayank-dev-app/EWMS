const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./Confige/mongoDataBase");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ------------------ AUTH ROUTES ------------------
app.use("/api/auth", require("./Routes/Auth"));  


// ------------------ ADMIN ROUTES ------------------
app.use("/api/admin", require("./Routes/Admin/Admin"));              // Admin main routes
app.use("/api/admin", require("./Routes/Admin/AdminEmpManager"));    // Employee + Manager create
app.use("/api/admin", require("./Routes/Admin/AdminDepartment"));    // Department CRUD
app.use("/api/admin", require("./Routes/Admin/AdminTask"));


// ------------------ MANAGER ROUTES ------------------
app.use("/api/manager", require("./Routes/Manager/AssignTask"));   // Assign Task
app.use("/api/manager", require("./Routes/Manager/Showlist"));     // Show task list (by manager)
app.use("/api/manager/", require("./Routes/Manager/TaskReport"));  //Report List

// ----------------- EMPLOYEE ROUTES --------------------
app.use("/api/employee", require("./Routes/Employee/EmpTask"));


// ---------------- GLOBAL ROUTE ------------------------
app.use("/api/global", require("./Routes/Global"));

// -----------------------------------------------------
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
