const {
  UserSubscription,
  SubscriptionPlan,
  sequelize
} = require("../models");

const upgradeSubscription = async (userId, newPlanId) => {
  return await sequelize.transaction(async (t) => {
    const newPlan = await SubscriptionPlan.findOne({
      where: { id: newPlanId, is_active: true },
      transaction: t
    });

    if (!newPlan) {
      throw new Error("PLAN_NOT_FOUND");
    }

    // Eski aktif subscription'ı kapat
    await UserSubscription.update(
      { is_active: false },
      {
        where: {
          user_id: userId,
          is_active: true
        },
        transaction: t
      }
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + newPlan.duration_month);

    const newSubscription = await UserSubscription.create(
      {
        user_id: userId,
        plan_id: newPlan.id,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
        remaining_appointments: newPlan.appointment_limit
      },
      { transaction: t }
    );

    return newSubscription;
  });
};

module.exports = {
  upgradeSubscription
};
