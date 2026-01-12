const profileService = require("../services/profile.service");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await profileService.getProfile(userId);

    return res.json(profile);
  } catch (error) {
    if (error.message === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }

    console.error("Get profile error:", error);
    return res.status(500).json({ error: "GET_PROFILE_ERROR" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, avatar_url, locale } = req.body;

    const profile = await profileService.updateProfile(userId, {
      first_name,
      last_name,
      phone,
      avatar_url,
      locale
    });

    return res.json(profile);
  } catch (error) {
    if (error.message === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }

    console.error("Update profile error:", error);
    return res.status(500).json({ error: "UPDATE_PROFILE_ERROR" });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
