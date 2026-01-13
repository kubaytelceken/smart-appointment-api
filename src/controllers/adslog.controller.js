const adsLogService = require("../services/adslog.service");

/**
 * LOG IMPRESSION
 * POST /ads-logs/impression
 * Public veya auth'lu user
 */
const logImpression = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    await adsLogService.logImpression({
      ad_id: req.body.ad_id,
      user_id: userId,
      source: req.body.source,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
    });

    // log başarısız olsa bile client'ı bloklamıyoruz
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(204).send();
  }
};

/**
 * LOG CLICK
 * POST /ads-logs/click
 * Public veya auth'lu user
 */
const logClick = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    await adsLogService.logClick({
      ad_id: req.body.ad_id,
      user_id: userId,
      source: req.body.source,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
    });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(204).send();
  }
};

/**
 * GET AD STATS (OWNER)
 * GET /ads-logs/:adId/stats
 */
const getAdStats = async (req, res) => {
  try {
    const { adId } = req.params;

    const stats = await adsLogService.getAdStats(adId);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  logImpression,
  logClick,
  getAdStats,
};
