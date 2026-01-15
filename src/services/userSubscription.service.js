const { UserSubscription, SubscriptionPlan, sequelize } = require("../models");
const { Op } = require("sequelize");

// Yeni abonelik oluştur
const createSubscription = async (businessId, planId) => {
  return await sequelize.transaction(async (t) => {
    const plan = await SubscriptionPlan.findOne({
      where: { id: planId, is_active: true },
      transaction: t
    });

    if (!plan) {
      throw new Error("PLAN_NOT_FOUND");
    }

    // Eski aktif subscription'ı kapat
    await UserSubscription.update(
      { is_active: false },
      {
        where: { business_id: businessId, is_active: true },
        transaction: t
      }
    );

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration_month);

    return await UserSubscription.create(
      {
        business_id: businessId,
        plan_id: plan.id,
        start_date: now,
        end_date: endDate,
        is_active: true,
        current_month_used: 0,
        current_period_start: now
      },
      { transaction: t }
    );
  });
};

// İşletmenin aktif aboneliğini getir
const getBusinessSubscription = async (businessId) => {
  return await UserSubscription.findOne({
    where: {
      business_id: businessId,
      is_active: true,
      end_date: { [Op.gt]: new Date() }
    },
    include: [{ model: SubscriptionPlan }]
  });
};

// Ay değiştiyse sayacı resetle
const checkAndResetMonthlyLimit = async (subscription) => {
  const now = new Date();
  const periodStart = new Date(subscription.current_period_start);

  if (now.getMonth() !== periodStart.getMonth() ||
      now.getFullYear() !== periodStart.getFullYear()) {
    await subscription.update({
      current_month_used: 0,
      current_period_start: now
    });
  }
  return subscription;
};

// Randevu oluşturulabilir mi?
const canCreateAppointment = async (businessId) => {
  const subscription = await getBusinessSubscription(businessId);

  if (!subscription) {
    throw new Error("NO_ACTIVE_SUBSCRIPTION");
  }

  await checkAndResetMonthlyLimit(subscription);

  const limit = subscription.SubscriptionPlan.appointment_limit;

  // null = sınırsız
  if (limit === null) return true;

  if (subscription.current_month_used >= limit) {
    throw new Error("MONTHLY_LIMIT_REACHED");
  }

  return true;
};

// Randevu sonrası sayacı artır
const incrementAppointmentCount = async (businessId) => {
  const subscription = await getBusinessSubscription(businessId);
  if (subscription) {
    await subscription.increment("current_month_used");
  }
};

// Aboneliği iptal et
const cancelSubscription = async (businessId) => {
  const sub = await UserSubscription.findOne({
    where: { business_id: businessId, is_active: true }
  });

  if (!sub) {
    throw new Error("SUBSCRIPTION_NOT_FOUND");
  }

  await sub.update({ is_active: false });
  return sub;
};

module.exports = {
  createSubscription,
  getBusinessSubscription,
  checkAndResetMonthlyLimit,
  canCreateAppointment,
  incrementAppointmentCount,
  cancelSubscription
};