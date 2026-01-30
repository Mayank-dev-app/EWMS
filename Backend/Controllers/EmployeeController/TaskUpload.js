const Task = require("../../models/TaskScheema");

exports.updateWork = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // 1️⃣ Status Update
    if (status) {
      task.status = status;
      if (status === "Completed") task.completedAt = new Date();
    }

    // 2️⃣ Add Comment
    if (comment && comment.trim() !== "" && req.user?._id) {
      task.comments.push({
        text: comment,
        by: req.user._id,
        at: new Date(),
      });
    }

    // 3️⃣ File Upload (Safe check)
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        task.uploads.push({
          name: file.originalname || "Unknown",
          url: file.path || file.secure_url || "", // fallback
          at: new Date(),
        });
      });
    }

    console.log("FILES RECEIVED:", req.files);

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    console.error("Update Work Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
