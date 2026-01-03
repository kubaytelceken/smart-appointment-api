const sequelize = require('../config/database');  // Bu satırı değiştir

const UserModel = require('./User');

const User = UserModel(sequelize);


module.exports = {
  User,
  sequelize
};