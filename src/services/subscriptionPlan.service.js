const { SubscriptionPlan } = require("../models");

const createPlan = async (data) => {
  return await SubscriptionPlan.create(data);
};

const getAllPlans = async () => {
  return await SubscriptionPlan.findAll({
    where: { is_active: true },
    order: [["price", "ASC"]]
  });
};

const getPlanById = async (planId) => {
  const plan = await SubscriptionPlan.findByPk(planId);
  if (!plan) throw new Error("PLAN_NOT_FOUND");
  return plan;
};

const updatePlan = async (planId, data) => {
  const plan = await getPlanById(planId);
  await plan.update(data);
  return plan;
};

const deactivatePlan = async (planId) => {
  const plan = await getPlanById(planId);
  await plan.update({ is_active: false });
  return plan;
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deactivatePlan
};
