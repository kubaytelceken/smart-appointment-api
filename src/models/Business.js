const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Business = sequelize.define(
    "Business",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "business_categories",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location_lat: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      location_lng: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "passive", "banned"),
        allowNull: false,
        defaultValue: "active",
      },
      // Business modeline eklenecek:
      country: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "TR",
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING, // ilçe
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "businesses",
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  return Business;
};
