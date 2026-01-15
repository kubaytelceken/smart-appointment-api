const jwt = require("jsonwebtoken");
const { User } = require("../models");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(401).json({ error: "USER_NOT_FOUND" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "ADMIN_ONLY" });
  }
  next();
};

const isProvider = (req, res, next) => {
  if (req.user.role !== "provider" && req.user.role !== "admin") {
    return res.status(403).json({ error: "PROVIDER_ONLY" });
  }
  next();
};

module.exports = {
  protect,
  isAdmin,
  isProvider
};