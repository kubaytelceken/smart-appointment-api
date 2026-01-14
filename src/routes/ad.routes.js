const express = require("express");
const router = express.Router();

const adController = require("../controllers/ad.controller");
const { protect } = require("../middleware/auth.middleware");
// 🔐 Tüm ad route'ları auth korumalı
router.use(protect);
// CREATE ad (business owner)
router.post("/", adController.createAd);

// GET business ads
router.get("/business/:businessId", adController.getBusinessAds);

// GET ad by id
router.get("/:adId", adController.getAdById);

// UPDATE ad
router.put("/:adId", adController.updateAd);

// PAUSE ad
router.patch("/:adId/pause", adController.pauseAd);

// ACTIVATE ad
router.patch("/:adId/activate", adController.activateAd);

module.exports = router;
