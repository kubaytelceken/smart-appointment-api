const { UserSubscription } = require("../models");
const { Op } = require("sequelize");

const checkAppointmentLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subscription = await UserSubscription.findOne({
      where: {
        user_id: userId,
        is_active: true,
        end_date: { [Op.gt]: new Date() }
      }
    });

    if (!subscription) {
      return res.status(403).json({
        error: "NO_ACTIVE_SUBSCRIPTION"
      });
    }

    if (subscription.remaining_appointments <= 0) {
      return res.status(403).json({
        error: "APPOINTMENT_LIMIT_EXCEEDED"
      });
    }

    // İstersen controller'da kullanmak için
    req.subscription = subscription;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "SUBSCRIPTION_CHECK_FAILED"
    });
  }
};

module.exports = {
  checkAppointmentLimit
};
