const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Profile = sequelize.define("Profile", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onDelete: "CASCADE"
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },

    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true
    },

    locale: {
      type: DataTypes.ENUM("tr", "en", "de"),
      allowNull: false,
      defaultValue: "tr"
    }

  }, {
    tableName: "profiles",
    timestamps: true,
    underscored: true,
    paranoid: true
  });

  return Profile;
};
