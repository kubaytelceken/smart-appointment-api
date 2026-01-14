const express = require("express");
const cors = require("cors");
const expireSubscriptionsJob = require("./cron/subscription.cron");



expireSubscriptionsJob();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/appointment", require("./routes/appointment.routes"));
app.use("/api/v1/adslog", require("./routes/adslog.routes"));
app.use("/api/v1/ad", require("./routes/ad.routes"));
app.use("/api/v1/business", require("./routes/business.routes"));
app.use("/api/v1/business-categories", require("./routes/business.category.routes"));
app.use("/api/v1/profile", require("./routes/profile.routes"));
app.use("/api/v1/service", require("./routes/service.routes"));
app.use("/api/v1/subscriptionPlan", require("./routes/subscriptionPlan.routes"));
app.use("/api/v1/subscriptionUpgrade", require("./routes/subscriptionUpgrade.routes"));
app.use("/api/v1/userSubscription", require("./routes/userSubscription.routes"));


// Routes
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
