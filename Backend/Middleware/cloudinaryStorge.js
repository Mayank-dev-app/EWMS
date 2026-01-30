const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// 🔥 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// 🔥 Cloudinary Storage Settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resource_type = "auto"; // default
    const ext = file.originalname.split(".").pop().toLowerCase();
    
    if (["pdf", "doc", "docx", "txt"].includes(ext)) {
      resource_type = "raw";
    }

    return {
      folder: "tasks",
      resource_type,
      format: ext, // optional, Cloudinary automatically detects
    };
  },
});


// 🔥 Multer Instance
const upload = multer({ storage });

module.exports = upload;
