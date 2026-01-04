const bcrypt = require("bcryptjs");
const { User, Profile } = require("../models");

const register = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password_hash: passwordHash,
    provider: "local",
    plan: "FREE",
    appointment_limit: 50,
    status: "active"
  });

  await Profile.create({
    user_id: user.id
  });

  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("EMAIL_OR_PASSWORD_WRONG");
  }

  if (user.status !== "active") {
    throw new Error("USER_NOT_ACTIVE");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("EMAIL_OR_PASSWORD_WRONG");
  }

  user.last_login_at = new Date();
  await user.save();

  return user;
};

module.exports = {
  register,
  login
};
