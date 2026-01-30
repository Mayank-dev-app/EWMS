const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./Confige/mongoDataBase");

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",        // local frontend (Vite)
  "https://ewms25.netlify.app/login", // production frontend
  "https://ewms25.netlify.app",
];

// ✅ CORS config
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());

/* ------------------ ROUTES ------------------ */

app.use("/api/auth", require("./Routes/Auth"));

app.use("/api/admin", require("./Routes/Admin/Admin"));
app.use("/api/admin", require("./Routes/Admin/AdminEmpManager"));
app.use("/api/admin", require("./Routes/Admin/AdminDepartment"));
app.use("/api/admin", require("./Routes/Admin/AdminTask"));

app.use("/api/manager", require("./Routes/Manager/AssignTask"));
app.use("/api/manager", require("./Routes/Manager/Showlist"));
app.use("/api/manager", require("./Routes/Manager/TaskReport"));

app.use("/api/employee", require("./Routes/Employee/EmpTask"));

app.use("/api/global", require("./Routes/Global"));

/* ------------------ SERVER ------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
