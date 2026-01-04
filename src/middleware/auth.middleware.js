const jwt = require("jsonwebtoken");
const { User } = require("../models");

const protect = async (req, res, next) => {
  try {
    // 1️⃣ Header kontrol
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    // 2️⃣ Token ayıkla
    const token = authHeader.split(" ")[1];

    // 3️⃣ Token doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ User DB’den çek
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(401).json({ error: "USER_NOT_FOUND" });
    }

    // 5️⃣ Request’e bağla
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
};

module.exports = {
  protect,
};
