const express = require("express");
const router = express.Router();

const subscriptionPlanController = require("../controllers/subscriptionPlan.controller");
const { protect, isAdmin } = require("../middleware/auth.middleware");

// GET all active plans (PUBLIC - herkes planları görebilmeli)
router.get("/", subscriptionPlanController.getPlans);

// GET plan by id (PUBLIC)
router.get("/:planId", subscriptionPlanController.getPlanById);

// 🔐 Admin only routes
router.post("/", protect, isAdmin, subscriptionPlanController.createPlan);
router.put("/:planId", protect, isAdmin, subscriptionPlanController.updatePlan);
router.delete("/:planId", protect, isAdmin, subscriptionPlanController.deletePlan);

module.exports = router;