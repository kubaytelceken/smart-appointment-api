const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AdsLog = sequelize.define(
    "AdsLog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      ad_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "ads",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "SET NULL"
      },

      action: {
        type: DataTypes.ENUM("impression", "click"),
        allowNull: false
      },

      source: {
        type: DataTypes.ENUM(
          "home",
          "category",
          "search",
          "business_detail"
        ),
        allowNull: false
      },

      ip_address: {
        type: DataTypes.STRING,
        allowNull: true
      },

      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: "ads_logs",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["ad_id"] },
        { fields: ["action"] }
      ]
    }
  );

  return AdsLog;
};
