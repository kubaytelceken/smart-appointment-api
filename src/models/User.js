const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },

      password_hash: {
        type: DataTypes.STRING,
        allowNull: true
      },

      provider: {
        type: DataTypes.ENUM("local", "google", "apple"),
        allowNull: false,
        defaultValue: "local"
      },

      provider_id: {
        type: DataTypes.STRING,
        allowNull: true
      },

      role: {
        type: DataTypes.ENUM("user", "provider", "admin"),
        allowNull: false,
        defaultValue: "user"
      },

      status: {
        type: DataTypes.ENUM("active", "passive", "banned"),
        allowNull: false,
        defaultValue: "active"
      },

      // 🔐 ABONELİK
      plan: {
        type: DataTypes.ENUM("FREE", "PRO"),
        allowNull: false,
        defaultValue: "FREE"
      },

      appointment_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50
      },

      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true
    }
  );

  return User;
};
