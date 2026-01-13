const express = require("express");
const router = express.Router();

const userSubscriptionController = require("../controllers/userSubscription.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 🔐 Tüm subscription işlemleri auth korumalı
router.use(authMiddleware);

// BUY subscription
router.post("/buy", userSubscriptionController.buySubscription);

// GET my active subscription
router.get("/me", userSubscriptionController.getMySubscription);

// CANCEL subscription
router.delete("/cancel", userSubscriptionController.cancelSubscription);

module.exports = router;
