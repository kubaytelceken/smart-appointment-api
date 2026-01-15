const {
  UserSubscription,
  SubscriptionPlan,
  sequelize
} = require("../models");

const upgradeSubscription = async (businessId, newPlanId) => {
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
          business_id: businessId,
          is_active: true
        },
        transaction: t
      }
    );

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + newPlan.duration_month);

    const newSubscription = await UserSubscription.create(
      {
        business_id: businessId,
        plan_id: newPlan.id,
        start_date: now,
        end_date: endDate,
        is_active: true,
        current_month_used: 0,
        current_period_start: now
      },
      { transaction: t }
    );

    return newSubscription;
  });
};

module.exports = {
  upgradeSubscription
};