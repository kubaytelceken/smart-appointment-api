const cron = require("node-cron");
const { UserSubscription } = require("../models");
const { Op } = require("sequelize");

const expireSubscriptionsJob = () => {
  // Her gece 02:00
  cron.schedule("0 2 * * *", async () => {
    try {
      const expiredCount = await UserSubscription.update(
        {
          is_active: false,
          remaining_appointments: 0
        },
        {
          where: {
            is_active: true,
            end_date: { [Op.lt]: new Date() }
          }
        }
      );

      console.log(
        `[CRON] Expired subscriptions updated: ${expiredCount[0]}`
      );
    } catch (err) {
      console.error("[CRON] Subscription expire failed", err);
    }
  });
};

module.exports = expireSubscriptionsJob;
