const Department = require("../../models/Department");
const Employee = require("../../models/CreateEmployee");
const Task = require("../../models/TaskScheema");

// GET all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// GET employees by department (by ID)
exports.GetEmployee = async (req, res) => {
  try {
    const { dept } = req.params; // dept here is ObjectId

    const employees = await Employee.find({ department: dept });

    return res.json({ success: true, employees });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Assign Task (Manager)
exports.assignTask = async (req, res) => {
  try {
    const {
      title,
      employee,
      department,
      dueDate,
      priority,
      description
    } = req.body;

    if (!title || !employee || !department || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const newTask = new Task({
      title,
      employee,
      department,
      dueDate,
      priority,
      description,

      status: "Pending",          // ✅ FIXED
      createdBy: req.user.id,

      uploads: [],
      approval: {
        approvedBy: null,
        approvedAt: null,
        remark: "",
      },
    });

    await newTask.save();

    const populatedTask = await Task.findById(newTask._id)
      .populate("employee", "name email")
      .populate("department", "name");

    res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      task: populatedTask,
    });

  } catch (error) {
    console.error("Assign Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("department", "name")
      .populate("employee", "name email");

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//GET TASK BY ID
exports.getTaskDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate("department", "name description")
      .populate("employee", "name email image phone role")
      .populate("createdBy", "name email role")
      .populate("comments.by", "name image");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.json({
      success: true,
      task,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

