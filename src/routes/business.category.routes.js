const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const businessController = require("../controllers/business.category.controller");

router.get("/", protect, businessController.getBusinessCategories);
router.get("/active", protect, businessController.getBusinessCategoriesWithActives);
router.post("/", protect, businessController.createBusinessCategory);
router.put("/:id", protect, businessController.updateBusinessCategory);
router.delete("/:id", protect, businessController.deleteBusinessCategory);


module.exports = router;
