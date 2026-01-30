const Employee = require("../../models/CreateEmployee");
const mongoose = require("mongoose");

// 👉 GET ALL EMPLOYEES
exports.GetAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("createdBy", "name email role") // Optional
      .sort({ createdAt: -1 }); // Latest first

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });

  } catch (error) {
    console.log("Get Employees Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error - Unable to fetch employees Get Employee API",
    });
  }
};


//Get Employee Byy Id
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error from Employee by ID" });
  }
};


// UPDATE EMPLOYEE BY ID
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, image } = req.body;

    // Find employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Check for email duplication
    if (email && email !== employee.email) {
      const existing = await Employee.findOne({ email: email });
      if (existing) {
        return res.status(400).json({ success: false, message: "Email already in use by another employee" });
      }
      employee.email = email; // only update if unique
    }

    // Update other fields if provided
    if (name) employee.name = name;
    if (role) employee.role = role;
    if (status) employee.status = status;
    if (image) employee.image = image;

    await employee.save();

    res.status(200).json({ success: true, message: "Employee updated successfully", employee });
  } catch (error) {
    console.error("Update Employee Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.FilterEmployees = async (req, res) => {
  try {
    const { department } = req.query;

    const query = {};

    if (department) {
      query.department = new mongoose.Types.ObjectId(department);
    }

    const employees = await Employee.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(employees); // Return ARRAY only (important)

  } catch (error) {
    console.log("Get Employees Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error - Unable to fetch employees",
    });
  }
};
