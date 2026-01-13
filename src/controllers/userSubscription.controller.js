const userSubscriptionService = require("../services/userSubscription.service");

// BUY PLAN
const buySubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    const subscription = await userSubscriptionService.createUserSubscription(
      userId,
      planId
    );

    res.status(201).json(subscription);
  } catch (err) {
    if (err.message === "PLAN_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: "SUBSCRIPTION_CREATE_FAILED" });
  }
};

// GET my active subscription
const getMySubscription = async (req, res) => {
  try {
    const subscription = await userSubscriptionService.getMySubscription(
      req.user.id
    );
    res.json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SUBSCRIPTION_FETCH_FAILED" });
  }
};

// CANCEL
const cancelSubscription = async (req, res) => {
  try {
    await userSubscriptionService.cancelSubscription(req.user.id);
    res.json({ message: "SUBSCRIPTION_CANCELLED" });
  } catch (err) {
    if (err.message === "SUBSCRIPTION_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: "SUBSCRIPTION_CANCEL_FAILED" });
  }
};

module.exports = {
  buySubscription,
  getMySubscription,
  cancelSubscription
};
