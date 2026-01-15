const {
  upgradeSubscription
} = require("../services/subscriptionUpgrade.service");

const upgradePlan = async (req, res) => {
  try {
    const { businessId, planId } = req.body;

    // TODO: Business'ın req.user'a ait olduğunu kontrol et

    const subscription = await upgradeSubscription(businessId, planId);

    res.status(201).json(subscription);
  } catch (err) {
    if (err.message === "PLAN_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: "SUBSCRIPTION_UPGRADE_FAILED" });
  }
};

module.exports = {
  upgradePlan
};