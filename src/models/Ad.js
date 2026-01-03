const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Ad = sequelize.define(
    "Ad",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "businesses",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      banner_url: {
        type: DataTypes.STRING,
        allowNull: true
      },

      placement: {
        type: DataTypes.ENUM(
          "home",
          "category",
          "search",
          "business_detail"
        ),
        allowNull: false
      },

      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },

      end_date: {
        type: DataTypes.DATE,
        allowNull: false
      },

      status: {
        type: DataTypes.ENUM("active", "paused", "expired"),
        defaultValue: "active"
      }
    },
    {
      tableName: "ads",
      timestamps: true,
      underscored: true
    }
  );

  return Ad;
};
