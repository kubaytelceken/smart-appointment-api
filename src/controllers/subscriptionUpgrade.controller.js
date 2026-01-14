const {
  upgradeSubscription
} = require("../services/subscriptionUpgrade.service");

const upgradePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    const subscription = await upgradeSubscription(userId, planId);

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
