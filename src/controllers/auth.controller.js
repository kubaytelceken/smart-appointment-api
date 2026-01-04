const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "EMAIL_AND_PASSWORD_REQUIRED",
      });
    }

    const user = await authService.register({ email, password });
    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        appointmentLimit: user.appointment_limit,
      },
    });
  } catch (err) {
    if (err.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: "REGISTER_FAILED" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.login({ email, password });
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (err) {
    if (
      err.message === "EMAIL_OR_PASSWORD_WRONG"
    ) {
      return res.status(401).json({ error: err.message });
    }

    if (err.message === "USER_NOT_ACTIVE") {
      return res.status(403).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: "LOGIN_FAILED" });
  }
};

module.exports = {
  register,
  login
};
