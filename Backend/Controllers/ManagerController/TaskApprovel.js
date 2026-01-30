// controllers/manager/approvalController.js

const Task = require("../../models/TaskScheema");

// controllers/TaskController.js
exports.submitTaskForApproval = async (req, res) => {
  try {
    const { taskId } = req.params;

    const files = req.files?.map(file => ({
      name: file.originalname,
      url: file.path,
    })) || [];

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        uploads: files,
        status: "Completed",
        completedAt: new Date(),
        approval: {
          status: "Pending",
          sentAt: new Date(),
        },
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task submitted for approval",
      task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getApprovalTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      status: "Completed",
      "approval.status": { $in: ["Pending", "Rejected", "Approved"] },
    })
      .populate("employee", "name email")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch approval tasks",
    });
  }
};

exports.approveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, remark } = req.body; // Approved | Rejected

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status",
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!["Pending", "Rejected"].includes(task.approval.status)) {
      return res.status(400).json({
        success: false,
        message: "Task already processed",
      });
    }


    // ✅ approval update
    task.approval.status = status;              // Approved / Rejected
    task.approval.manager = req.user.id;        // manager id
    task.approval.managerComment = remark || "";
    task.approval.decidedAt = new Date();

    await task.save();

    res.json({
      success: true,
      message: `Task ${status} successfully`,
      task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update task approval",
    });
  }
};

