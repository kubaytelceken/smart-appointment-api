const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "UserSubscription",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      remaining_appointments: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "user_subscriptions",
      timestamps: true,
      underscored: true,
    }
  );
};
