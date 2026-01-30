const Department = require("../../models/Department");
const Task = require("../../models/TaskScheema");

exports.getDepartmentTaskSummary = async (req, res) => {
  try {
    const summary = await Department.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "department",
          as: "tasks",
        },
      },
      {
        $addFields: {
          total: { $size: "$tasks" },

          pending: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "t",
                cond: { $eq: ["$$t.status", "Pending"] },
              },
            },
          },

          inProgress: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "t",
                cond: { $eq: ["$$t.status", "In Progress"] },
              },
            },
          },

          completed: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "t",
                cond: { $eq: ["$$t.status", "Completed"] },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$name", // ✅ NAME ja raha hai
          total: 1,
          pending: 1,
          inProgress: 1,
          completed: 1,
        },
      },
    ]);

    res.json({ success: true, data: summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.getTasksByDepartment = async (req, res) => {
  try {
    const { dept } = req.params;   // "IT"
    const { status } = req.query;

    // 1️⃣ Department find by NAME
    const department = await Department.findOne({ name: dept });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // 2️⃣ Filter using ObjectId
    const filter = { department: department._id };

    if (status && status !== "All") {
      filter.status = status;
    }

    // 3️⃣ Fetch tasks
    const tasks = await Task.find(filter)
      .populate("employee", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    console.error("getTasksByDepartment error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
