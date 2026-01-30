const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_2025";

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // ← IMPORTANT (id, email, role)
    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
    console.log(err);
  }
};

exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Role not allowed" });
    }
    next();
  };
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin Access Denied" });
  }
  next();
};

exports.verifyManager = (req, res, next) => {
  if (req.user.role !== "Manager") {
    return res.status(403).json({ message: "Manager Access Denied" });
  }
  next();
};