const { Ad, Business } = require("../models");
const { Op } = require("sequelize");

/**
 * CREATE AD (BUSINESS OWNER)
 */
const createAd = async (ownerId, adModel) => {
  const business = await Business.findOne({
    where: {
      id: adModel.business_id,
      owner_id: ownerId,
      status: "active",
    },
  });

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  if (new Date(adModel.start_date) >= new Date(adModel.end_date)) {
    throw new Error("INVALID_DATE_RANGE");
  }

  const ad = await Ad.create({
    business_id: adModel.business_id,
    title: adModel.title,
    description: adModel.description,
    banner_url: adModel.banner_url,
    placement: adModel.placement,
    start_date: adModel.start_date,
    end_date: adModel.end_date,
    status: adModel.status ?? "active",
  });

  return ad;
};

/**
 * GET AD BY ID (OWNER)
 */
const getAdById = async (ownerId, adId) => {
  const ad = await Ad.findOne({
    where: { id: adId },
    include: [
      {
        model: Business,
        where: { owner_id: ownerId },
        attributes: [],
      },
    ],
  });

  if (!ad) {
    throw new Error("AD_NOT_FOUND");
  }

  return ad;
};

/**
 * GET BUSINESS ADS (OWNER)
 */
const getBusinessAds = async (ownerId, businessId) => {
  const business = await Business.findOne({
    where: {
      id: businessId,
      owner_id: ownerId,
    },
  });

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const ads = await Ad.findAll({
    where: {
      business_id: businessId,
    },
    order: [["created_at", "DESC"]],
  });

  return ads;
};

/**
 * UPDATE AD
 */
const updateAd = async (ownerId, adId, updateModel) => {
  const ad = await Ad.findOne({
    where: { id: adId },
    include: [
      {
        model: Business,
        where: { owner_id: ownerId },
        attributes: [],
      },
    ],
  });

  if (!ad) {
    throw new Error("AD_NOT_FOUND");
  }

  if (
    updateModel.start_date &&
    updateModel.end_date &&
    new Date(updateModel.start_date) >= new Date(updateModel.end_date)
  ) {
    throw new Error("INVALID_DATE_RANGE");
  }

  await ad.update({
    title: updateModel.title,
    description: updateModel.description,
    banner_url: updateModel.banner_url,
    placement: updateModel.placement,
    start_date: updateModel.start_date,
    end_date: updateModel.end_date,
    status: updateModel.status,
  });

  return ad;
};

/**
 * PAUSE AD
 */
const pauseAd = async (ownerId, adId) => {
  const ad = await Ad.findOne({
    where: { id: adId },
    include: [
      {
        model: Business,
        where: { owner_id: ownerId },
        attributes: [],
      },
    ],
  });

  if (!ad) {
    throw new Error("AD_NOT_FOUND");
  }

  if (ad.status !== "active") {
    return ad;
  }

  await ad.update({ status: "paused" });

  return ad;
};

/**
 * ACTIVATE AD
 */
const activateAd = async (ownerId, adId) => {
  const ad = await Ad.findOne({
    where: { id: adId },
    include: [
      {
        model: Business,
        where: { owner_id: ownerId },
        attributes: [],
      },
    ],
  });

  if (!ad) {
    throw new Error("AD_NOT_FOUND");
  }

  if (new Date(ad.end_date) < new Date()) {
    throw new Error("AD_EXPIRED");
  }

  await ad.update({ status: "active" });

  return ad;
};

/**
 * EXPIRE CHECK (CRON READY)
 */
const expireAds = async () => {
  await Ad.update(
    { status: "expired" },
    {
      where: {
        end_date: { [Op.lt]: new Date() },
        status: { [Op.ne]: "expired" },
      },
    }
  );
};

module.exports = {
  createAd,
  getAdById,
  getBusinessAds,
  updateAd,
  pauseAd,
  activateAd,
  expireAds,
};
