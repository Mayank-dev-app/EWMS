const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    dueDate: {
      type: Date,
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // 🟩 Uploaded Files
    uploads: [
      {
        name: String,
        url: String,
        comment: { type: String, default: "" },
        progressNote: { type: String, default: "" },
        at: { type: Date, default: Date.now },
      },
    ],

    // 🟦 Comments
    comments: [
      {
        text: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        at: { type: Date, default: Date.now },
      },
    ],

    // 🟨 APPROVAL SYSTEM (NEW)
    approval: {
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null,
      },
      managerComment: {
        type: String,
        default: "",
      },
      sentAt: {
        type: Date,
        default: null,
      },
      decidedAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
