const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const bcrypt = require("bcrypt");
const Employee = require("../../models/CreateEmployee");
const Department = require("../../models/Department");

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// 🔹 Multer Storage (Cloudinary)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "EWMS/Employees",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => "EMP_" + Date.now(),
  },
});

const upload = multer({ storage });

// 🔹 ADD EMPLOYEE CONTROLLER
const AddEmployeeController = async (req, res) => {
  try {
    const { name, email, password, role, department, phone, status } = req.body;

    // ------------------ Validation ------------------
    if (!name || !email || !password || !role || !department || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(400).json({
        success: false,
        message: "Department not found",
      });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    // Manager Check in same department
    if (role === "Manager") {
      const existingManager = await Employee.findOne({
        department: department,
        role: "Manager",
      });

      if (existingManager) {
        return res.status(400).json({
          success: false,
          message: "This department already has a Manager!",
        });
      }
    }

    // ------------------ Hash Password ------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ------------------ Image Upload ------------------
    let imageUrl = "";
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    // ------------------ Create Employee ------------------
    const newEmployee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      department: dept._id,
      status: status || "Active",
      image: imageUrl,
      createdBy: req.adminId,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: newEmployee,
    });

  } catch (error) {
    console.log("Add Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error - AddEmployee API",
    });
  }
};

module.exports = { upload, AddEmployeeController };
