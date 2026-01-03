require("dotenv").config();
const app = require("./src/app");

// 🔥 MODELLERİ YÜKLE
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected");

    // ⛔ SADECE DEVELOPMENT
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start error:", error);
    process.exit(1);
  }
};

startServer();
