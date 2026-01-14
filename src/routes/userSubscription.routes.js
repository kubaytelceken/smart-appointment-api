const express = require("express");
const router = express.Router();

const userSubscriptionController = require("../controllers/userSubscription.controller");
const { protect } = require("../middleware/auth.middleware");
// 🔐 Tüm ad route'ları auth korumalı
router.use(protect);

// BUY subscription
router.post("/buy", userSubscriptionController.buySubscription);

// GET my active subscription
router.get("/me", userSubscriptionController.getMySubscription);

// CANCEL subscription
router.delete("/cancel", userSubscriptionController.cancelSubscription);

module.exports = router;
