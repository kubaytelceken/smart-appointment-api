const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "EMAIL_AND_PASSWORD_REQUIRED"
      });
    }

    const user = await authService.register({ email, password });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        appointmentLimit: user.appointment_limit
      }
    });
  } catch (err) {
    if (err.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: "REGISTER_FAILED" });
  }
};

module.exports = {
  register
};
