const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Service = sequelize.define(
    "Service",
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

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },

      is_online_bookable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },

      status: {
        type: DataTypes.ENUM("active", "passive"),
        defaultValue: "active"
      }
    },
    {
      tableName: "services",
      timestamps: true,
      underscored: true
    }
  );

  return Service;
};
