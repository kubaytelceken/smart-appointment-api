const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "businesses",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      service_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "services",
          key: "id",
        },
        onDelete: "RESTRICT",
      },

      appointment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },

      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "approved",
          "cancelled",
          "completed",
          "no_show"
        ),
        defaultValue: "pending",
      },

      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "appointments",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["business_id", "appointment_date"],
        },
      ],
    }
  );

  return Appointment;
};
