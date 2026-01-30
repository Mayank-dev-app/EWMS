const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["Admin", "Manager", "Sales Executive", "Inventory Manager", "Web Developer", "Software Developer"],
    },

    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },

    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },

    image: {
      type: String,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    phone: {
      type: String,
      trim: true,
    },

    // ⭐ OTP FIELDS ADD HERE
    resetOtp: {
      type: String,
      default: null,
    },

    otpExpire: {
      type: Number, // store timestamp (Date.now() value)
      default: null,
    },
    OtpVerify: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
