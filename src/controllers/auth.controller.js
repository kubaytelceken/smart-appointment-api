const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { email, password,firstName,lastName,phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "EMAIL_AND_PASSWORD_REQUIRED",
      });
    }

    const user = await authService.register({ email, password,firstName,lastName,phone });
    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
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
      },
    });
  } catch (err) {
    if (err.message === "EMAIL_OR_PASSWORD_WRONG") {
      return res.status(401).json({ error: err.message });
    }

    if (err.message === "USER_NOT_ACTIVE") {
      return res.status(403).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: "LOGIN_FAILED" });
  }
};


const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;
    const user = await authService.verifyGoogleToken(idToken);
    const token = generateToken(user.id);

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "INVALID_GOOGLE_TOKEN" });
  }
};

const appleSignIn = async (req, res) => {
  try {
    const { identityToken, email, fullName } = req.body;
    const user = await authService.verifyAppleToken(identityToken, email, fullName);
    const token = generateToken(user.id);

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "INVALID_TOKEN" });
  }
};

module.exports = {
  register,
  login,
  googleSignIn,
  appleSignIn
};