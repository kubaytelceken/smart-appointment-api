const { Profile } = require("../models");

const getProfile = async (userId) => {
  const profile = await Profile.findOne({
    where: { user_id: userId }
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return profile;
};

const updateProfile = async (userId, payload) => {
  const profile = await Profile.findOne({
    where: { user_id: userId }
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }


  const allowedFields = [
    "first_name",
    "last_name",
    "phone",
    "avatar_url",
    "locale"
  ];

  for (const field of allowedFields) {
    if (payload[field] !== undefined) {
      profile[field] = payload[field];
    }
  }

  await profile.save();

  return profile;
};

module.exports = {
  getProfile,
  updateProfile
};
