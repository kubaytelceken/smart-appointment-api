const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 🔐 Tüm profile endpointleri login zorunlu
router.use(authMiddleware);

// 👤 Kendi profilimi getir
router.get("/me", profileController.getProfile);

// ✏️ Kendi profilimi güncelle
router.put("/me", profileController.updateProfile);

module.exports = router;
