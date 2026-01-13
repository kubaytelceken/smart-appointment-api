const subscriptionPlanService = require("../services/subscriptionPlan.service");

// CREATE
const createPlan = async (req, res) => {
  try {
    const plan = await subscriptionPlanService.createPlan(req.body);
    res.status(201).json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PLAN_CREATE_FAILED" });
  }
};

// GET all active plans
const getPlans = async (req, res) => {
  try {
    const plans = await subscriptionPlanService.getAllPlans();
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PLANS_FETCH_FAILED" });
  }
};

// GET by id
const getPlanById = async (req, res) => {
  try {
    const plan = await subscriptionPlanService.getPlanById(req.params.planId);
    res.json(plan);
  } catch (err) {
    if (err.message === "PLAN_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "PLAN_FETCH_FAILED" });
  }
};

// UPDATE
const updatePlan = async (req, res) => {
  try {
    const plan = await subscriptionPlanService.updatePlan(
      req.params.planId,
      req.body
    );
    res.json(plan);
  } catch (err) {
    if (err.message === "PLAN_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "PLAN_UPDATE_FAILED" });
  }
};

// DELETE (soft)
const deletePlan = async (req, res) => {
  try {
    await subscriptionPlanService.deactivatePlan(req.params.planId);
    res.json({ message: "PLAN_DEACTIVATED" });
  } catch (err) {
    if (err.message === "PLAN_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "PLAN_DELETE_FAILED" });
  }
};

module.exports = {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan
};
