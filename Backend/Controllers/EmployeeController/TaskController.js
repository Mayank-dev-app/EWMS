const Task = require("../../models/TaskScheema");

// ⭐ 1. Fetch tasks assigned to login employee
exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ employee: req.user.id })
            .populate("employee", "name email")
            .populate("department", "name")
            .populate("approval.manager", "name role");

        res.json({
            success: true,
            tasks,
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// ⭐ 2. Update task status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { taskId } = req.params;

        const task = await Task.findById(taskId);

        if (!task) return res.status(404).json({ msg: "Task not found" });

        if (task.approval?.status === "Approved") {
            return res.status(403).json({
                success: false,
                msg: "Approved task cannot be modified",
            });
        }

        task.status = status;
        task.completedAt =
            status === "Completed"
                ? new Date().toISOString().slice(0, 10)
                : task.completedAt;

        await task.save();

        res.json({ success: true, task });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
    }
};

exports.uploadFiles = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, msg: "Task not found" });
        }

        if (task.approval?.status === "Approved") {
            return res.status(403).json({
                success: false,
                msg: "Approved task uploads are locked",
            });
        }

        const uploads = req.files.map((file, i) => ({
            id: `${Date.now()}-${i}`,
            name: file.originalname,
            url: file.path,           // ✅ Cloudinary secure URL
            public_id: file.filename  // ✅ important for delete later
        }));

        task.uploads.push(...uploads);
        await task.save();

        res.json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// ⭐ 4. Add comment
exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "Comment text required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔒 lock after approval
    if (task.approval?.status === "Approved") {
      return res.status(403).json({
        success: false,
        msg: "Comments are locked after approval",
      });
    }

    const comment = {
      id: Date.now().toString(),
      text,
      author: req.user.name,
      at: new Date().toISOString().slice(0, 10),
    };

    task.comments.push(comment);
    await task.save();

    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ⭐ 5. Remove uploaded file
exports.removeUpload = async (req, res) => {
  try {
    const { taskId, uploadId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.approval?.status === "Approved") {
      return res.status(403).json({
        success: false,
        msg: "Approved task uploads are locked",
      });
    }

    task.uploads = task.uploads.filter(u => u.id !== uploadId);
    await task.save();

    res.json({ success: true, uploads: task.uploads });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
