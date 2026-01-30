const Employee = require("../../models/CreateEmployee");

exports.ManagerListController = async (req, res) => {
    try {
        // Sirf Manager role wale employees
        const managers = await Employee.find({ role: "Manager" })
            .select("name email phone role department")
            .populate("department", "name")
            .sort({ createdAt: -1 });
        // latest first

        return res.status(200).json({
            success: true,
            message: "Managers fetched successfully",
            managers,
        });

    } catch (error) {
        console.log("ManagerList Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error From Server - ManagerList Controller API",
        });
    }
};

exports.checkManager = async (req, res) => {
  try {
    const manager = await Employee.findOne({
      department: req.params.deptId,
      role: "Manager"
    });

    res.json({ exists: manager ? true : false });
  } catch (error) {
    res.status(500).json({ message: "Server erro- check manager" });
  }
};
