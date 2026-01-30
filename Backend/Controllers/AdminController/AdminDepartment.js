const Employee = require("../../models/CreateEmployee");
const Department = require("../../models/Department");

exports.getDepartments = async (req, res) => {
    try {
        // Fetch all departments from Department collection
        const departments = await Department.find({});

        // Count employees in each department
        const departmentsWithCount = await Promise.all(
            departments.map(async (dept) => {
                const count = await Employee.countDocuments({ department: dept._id });
                return {
                    _id: dept._id,
                    name: dept.name,
                    employeesCount: count,
                    icon: dept.icon || "Users"
                };
            })
        );

        res.status(200).json({
            success: true,
            departments: departmentsWithCount
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error- GET DEPARTMENT API"
        });
    }
};


//----------------
// Get Single Department by ID
exports.getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === "undefined") {
            return res.status(400).json({ success: false, message: "Department ID is required" });
        }

        // Fetch department info
        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        // Fetch employees belonging to this department
        const employees = await Employee.find({ department: id });

        res.status(200).json({
            success: true,
            department: {
                ...department.toObject(),
                employees, // yahan populate kar rahe hain dynamically
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
