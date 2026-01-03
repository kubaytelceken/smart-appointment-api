const bcrypt = require("bcryptjs");
const { User } = require("../models");

const register = async ({ email, password }) => {
  // email kontrol
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  // password hash
  const passwordHash = await bcrypt.hash(password, 10);

  // user oluştur
  const user = await User.create({
    email,
    password_hash: passwordHash,
    provider: "local",
    plan: "FREE",
    appointment_limit: 50
  });

  return user;
};

module.exports = {
  register
};
