const Department = require("../../models/Department");

exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Validate
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Department ID is required",
            });
        }

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Department name is required",
            });
        }

        // If a new icon image is uploaded
        let iconPath = null;
        if (req.file) {
            iconPath = `/uploads/${req.file.filename}`;
        }

        // Prepare update fields
        const updateData = {
            name,
            description,
        };

        if (iconPath) {
            updateData.icon = iconPath;  // Update only if new file is uploaded
        }

        // Update department
        const updatedDept = await Department.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedDept) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            department: updatedDept,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error during department update",
            error: error.message,
        });
    }
};
