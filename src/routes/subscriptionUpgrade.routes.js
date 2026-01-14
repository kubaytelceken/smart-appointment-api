const express = require("express");
const router = express.Router();

const subscriptionUpgradeController = require("../controllers/subscriptionUpgrade.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

// UPGRADE plan
router.post("/upgrade", subscriptionUpgradeController.upgradePlan);

module.exports = router;
