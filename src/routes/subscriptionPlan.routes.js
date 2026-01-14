const express = require("express");
const router = express.Router();

const subscriptionPlanController = require("../controllers/subscriptionPlan.controller");
const { protect } = require("../middleware/auth.middleware");
// 🔐 Tüm ad route'ları auth korumalı
router.use(protect);

// CREATE plan
router.post("/", subscriptionPlanController.createPlan);

// GET all active plans
router.get("/", subscriptionPlanController.getPlans);

// GET plan by id
router.get("/:planId", subscriptionPlanController.getPlanById);

// UPDATE plan
router.put("/:planId", subscriptionPlanController.updatePlan);

// DELETE plan (soft)
router.delete("/:planId", subscriptionPlanController.deletePlan);

module.exports = router;
