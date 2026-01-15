const userSubscriptionService = require("../services/userSubscription.service");

// BUY PLAN (for a business)
const buySubscription = async (req, res) => {
  try {
    const { businessId, planId } = req.body;

    // TODO: Business'ın req.user'a ait olduğunu kontrol et

    const subscription = await userSubscriptionService.createSubscription(
      businessId,
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

// GET business subscription
const getBusinessSubscription = async (req, res) => {
  try {
    const { businessId } = req.params;

    const subscription = await userSubscriptionService.getBusinessSubscription(
      businessId
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
    const { businessId } = req.params;

    await userSubscriptionService.cancelSubscription(businessId);
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
  getBusinessSubscription,
  cancelSubscription
};