const express = require("express");
const cors = require("cors");
const expireSubscriptionsJob = require("./cron/subscription.cron");

expireSubscriptionsJob();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/appointments", require("./routes/appointment.routes"));
app.use("/api/v1/ads-logs", require("./routes/adslog.routes"));
app.use("/api/v1/ads", require("./routes/ad.routes"));
app.use("/api/v1/businesses", require("./routes/business.routes"));
// app.use("/api/v1/business-categories", ...); // SİLİNDİ
app.use("/api/v1/profile", require("./routes/profile.routes"));
app.use("/api/v1/services", require("./routes/service.routes"));
app.use("/api/v1/subscription-plans", require("./routes/subscriptionPlan.routes"));
app.use("/api/v1/subscription-upgrade", require("./routes/subscriptionUpgrade.routes"));
app.use("/api/v1/user-subscriptions", require("./routes/userSubscription.routes"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

module.exports = app;