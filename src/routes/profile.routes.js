const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.controller");
const { protect } = require("../middleware/auth.middleware");
// 🔐 Tüm ad route'ları auth korumalı
router.use(protect);

// 👤 Kendi profilimi getir
router.get("/me", profileController.getProfile);

// ✏️ Kendi profilimi güncelle
router.put("/me", profileController.updateProfile);

module.exports = router;
