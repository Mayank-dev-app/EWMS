const Task = require("../../models/TaskScheema");

exports.getTaskReports = async (req, res) => {
  try {
    const { department, employee, status } = req.query;

    let filter = {};

    // 🔍 Filter by Department (ObjectId)
    if (department) {
      filter.department = department; // must be ObjectId
    }

    // 🔍 Filter by Employee
    if (employee) {
      filter.employee = employee;
    }

    // 🔍 Filter by Status
    if (status) {
      filter.status = status;
    }

    const reports = await Task.find(filter)
      .populate("employee", "name email")
      .populate("department", "name") // ⭐⭐ Missing line — fixes department show
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.log("Task Reports Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
