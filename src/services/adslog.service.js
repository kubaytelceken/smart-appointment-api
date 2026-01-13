const { AdsLog, Ad } = require("../models");

/**
 * LOG AD IMPRESSION
 * (Public veya auth'lu user olabilir)
 */
const logImpression = async ({
  ad_id,
  user_id = null,
  source,
  ip_address,
  user_agent,
}) => {
  // Reklam var mı ve aktif mi?
  const ad = await Ad.findOne({
    where: {
      id: ad_id,
      status: "active",
    },
  });

  if (!ad) {
    // bilinçli: hata fırlatmıyoruz
    // log sisteminin API'yi kırmaması lazım
    return null;
  }

  const log = await AdsLog.create({
    ad_id,
    user_id,
    action: "impression",
    source,
    ip_address,
    user_agent,
  });

  return log;
};

/**
 * LOG AD CLICK
 */
const logClick = async ({
  ad_id,
  user_id = null,
  source,
  ip_address,
  user_agent,
}) => {
  const ad = await Ad.findOne({
    where: {
      id: ad_id,
      status: "active",
    },
  });

  if (!ad) {
    return null;
  }

  const log = await AdsLog.create({
    ad_id,
    user_id,
    action: "click",
    source,
    ip_address,
    user_agent,
  });

  return log;
};

/**
 * GET AD STATS (OWNER)
 */
const getAdStats = async (adId) => {
  const impressions = await AdsLog.count({
    where: {
      ad_id: adId,
      action: "impression",
    },
  });

  const clicks = await AdsLog.count({
    where: {
      ad_id: adId,
      action: "click",
    },
  });

  return {
    ad_id: adId,
    impressions,
    clicks,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
  };
};

module.exports = {
  logImpression,
  logClick,
  getAdStats,
};
