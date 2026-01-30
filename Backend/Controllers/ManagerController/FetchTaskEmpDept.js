const Employee = require("../../models/CreateEmployee");
const Department = require("../../models/Department");
const Task = require("../../models/TaskScheema");

exports.getDashboardSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalTasks = await Task.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasksToday = await Task.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalDepartments,
        totalTasks,
        tasksToday,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.getEmployeePerformance = async (req, res) => {
  try {
    // Sab employees fetch karo
    const employees = await Employee.find({});

    // Har employee ke liye completed tasks count karo
    const performance = await Promise.all(
      employees.map(async (emp) => {
        const completedTasks = await Task.countDocuments({
          assignedTo: emp._id,
          status: "Completed",
        });

        return {
          name: emp.name,
          completedTasks,
        };
      })
    );

    res.json({
      success: true,
      data: performance,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
