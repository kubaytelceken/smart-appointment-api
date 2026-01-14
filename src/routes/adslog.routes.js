const express = require("express");
const router = express.Router();

const adsLogController = require("../controllers/adslog.controller");
const { protect } = require("../middleware/auth.middleware");
router.use(protect);
/**
 * PUBLIC LOG ROUTES
 * (auth zorunlu değil)
 */

// Ad impression
router.post("/impression", adsLogController.logImpression);

// Ad click
router.post("/click", adsLogController.logClick);

/**
 * OWNER ROUTES
 */

// Ad stats (auth gerekli)
router.get(
  "/:adId/stats",
  adsLogController.getAdStats
);

module.exports = router;
