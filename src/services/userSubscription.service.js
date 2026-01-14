const { UserSubscription, SubscriptionPlan } = require("../models");
const { Op } = require("sequelize");

const createUserSubscription = async (userId, planId) => {
  return await sequelize.transaction(async (t) => {
    const plan = await SubscriptionPlan.findOne({
      where: { id: planId, is_active: true },
      transaction: t
    });

    if (!plan) {
      throw new Error("PLAN_NOT_FOUND");
    }

    // Önce eski aktif subscription'ı kapat
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
    endDate.setMonth(endDate.getMonth() + plan.duration_month);

    const subscription = await UserSubscription.create(
      {
        user_id: userId,
        plan_id: plan.id,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
        remaining_appointments: plan.appointment_limit
      },
      { transaction: t }
    );

    return subscription;
  });
};

const getMySubscription = async (userId) => {
  return await UserSubscription.findOne({
    where: {
      user_id: userId,
      is_active: true,
      end_date: { [Op.gt]: new Date() }
    },
    include: [
      {
        model: SubscriptionPlan,
        attributes: ["name", "price", "appointment_limit"]
      }
    ]
  });
};

const cancelSubscription = async (userId) => {
  const sub = await UserSubscription.findOne({
    where: {
      user_id: userId,
      is_active: true
    }
  });

  if (!sub) {
    throw new Error("SUBSCRIPTION_NOT_FOUND");
  }

  await sub.update({ is_active: false });
  return sub;
};

module.exports = {
  createUserSubscription,
  getMySubscription,
  cancelSubscription
};
