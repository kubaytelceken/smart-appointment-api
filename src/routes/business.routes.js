const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const businessController = require("../controllers/business.controller");

/**
 * CREATE business (auth required)
 */
router.post("/", protect, businessController.createBusiness);

/**
 * GET my businesses (auth required)
 */
router.get("/my", protect, businessController.getMyBusinesses);

/**
 * GET business by id (public)
 */
router.get("/:businessId", businessController.getBusinessById);

/**
 * UPDATE business (auth + owner)
 */
router.put("/:businessId", protect, businessController.updateBusiness);

/**
 * DELETE business (auth + owner) - soft delete
 */
router.delete("/:businessId", protect, businessController.deleteBusiness);

module.exports = router;
