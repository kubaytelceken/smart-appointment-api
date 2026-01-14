const {
  SubscriptionPlan,
  UserSubscription
} = require("../models");

const assignFreeSubscription = async (userId) => {
  const freePlan = await SubscriptionPlan.findOne({
    where: {
      code: "FREE",
      is_active: true
    }
  });

  if (!freePlan) {
    throw new Error("FREE_PLAN_NOT_FOUND");
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + freePlan.duration_month);

  return await UserSubscription.create({
    user_id: userId,
    plan_id: freePlan.id,
    start_date: startDate,
    end_date: endDate,
    is_active: true,
    remaining_appointments: freePlan.appointment_limit
  });
};

module.exports = {
  assignFreeSubscription
};
