const Employee = require("../../models/CreateEmployee");
const Department = require("../../models/Department");
const Task = require("../../models/TaskScheema");

exports.AdminDashboardCounts = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalTasks = await Task.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Dashboard counts fetched",
      totalEmployees,
      totalDepartments,
      totalTasks,
    });
  } catch (error) {
    console.log("Dashboard Count Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error - Dashboard Count API",
    });
  }
};
