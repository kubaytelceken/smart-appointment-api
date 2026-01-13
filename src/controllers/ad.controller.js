const adService = require("../services/ad.service");

/**
 * CREATE AD (BUSINESS OWNER)
 * POST /ads
 */
const createAd = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const ad = await adService.createAd(ownerId, req.body);

    res.status(201).json(ad);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET AD BY ID (OWNER)
 * GET /ads/:adId
 */
const getAdById = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { adId } = req.params;

    const ad = await adService.getAdById(ownerId, adId);

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

/**
 * GET BUSINESS ADS (OWNER)
 * GET /ads/business/:businessId
 */
const getBusinessAds = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { businessId } = req.params;

    const ads = await adService.getBusinessAds(ownerId, businessId);

    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * UPDATE AD
 * PUT /ads/:adId
 */
const updateAd = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { adId } = req.params;

    const ad = await adService.updateAd(ownerId, adId, req.body);

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * PAUSE AD
 * PATCH /ads/:adId/pause
 */
const pauseAd = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { adId } = req.params;

    const ad = await adService.pauseAd(ownerId, adId);

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * ACTIVATE AD
 * PATCH /ads/:adId/activate
 */
const activateAd = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { adId } = req.params;

    const ad = await adService.activateAd(ownerId, adId);

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createAd,
  getAdById,
  getBusinessAds,
  updateAd,
  pauseAd,
  activateAd,
};
