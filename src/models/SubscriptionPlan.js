const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "SubscriptionPlan",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      appointment_limit: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      duration_month: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "subscription_plans",
      timestamps: true,
      underscored: true
    }
  );
};
