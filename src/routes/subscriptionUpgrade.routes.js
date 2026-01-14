const express = require("express");
const router = express.Router();

const subscriptionUpgradeController = require("../controllers/subscriptionUpgrade.controller");
const { protect } = require("../middleware/auth.middleware");
// 🔐 Tüm ad route'ları auth korumalı
router.use(protect);

// UPGRADE plan
router.post("/upgrade", subscriptionUpgradeController.upgradePlan);

module.exports = router;
