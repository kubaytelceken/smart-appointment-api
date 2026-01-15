const express = require("express");
const router = express.Router();

const userSubscriptionController = require("../controllers/userSubscription.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

// BUY subscription (for a business)
router.post("/buy", userSubscriptionController.buySubscription);

// GET business subscription
router.get("/business/:businessId", userSubscriptionController.getBusinessSubscription);

// CANCEL subscription
router.delete("/business/:businessId/cancel", userSubscriptionController.cancelSubscription);

module.exports = router;