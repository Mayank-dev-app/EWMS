const Department = require("../../models/Department");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "EWMS/Departments",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => file.fieldname + "_" + Date.now(),
  },
});

const upload = multer({ storage });

const addDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Name and description are required" });
    }

    // 🔥 Check if department with same name already exists
    const existingDept = await Department.findOne({ name: name.trim() });
    if (existingDept) {
      return res.status(400).json({ success: false, message: "Department with this name already exists" });
    }

    // Optional icon
    let iconUrl = "";
    if (req.file && req.file.path) iconUrl = req.file.path;

    const newDepartment = new Department({ 
      name: name.trim(), 
      description, 
      icon: iconUrl // optional
    });

    await newDepartment.save();

    res.status(201).json({ success: true, message: "Department created", department: newDepartment });
  } catch (err) {
    console.log("Add Department Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { upload, addDepartment };
