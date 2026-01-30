const Task = require("../../models/TaskScheema");

// GET All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;

    const tasks = await Task.find().populate("employee", "name")      // populate employee name
      .populate("department", "name")
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, tasks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};