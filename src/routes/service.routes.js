const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 🔐 Tüm servisler auth korumalı
router.use(authMiddleware);

// CREATE service (business owner)
router.post("/", serviceController.createService);

// GET business services
router.get("/business/:businessId", serviceController.getBusinessServices);

// GET service by id
router.get("/:serviceId", serviceController.getServiceById);

// UPDATE service
router.put("/:serviceId", serviceController.updateService);

// DELETE service (soft)
router.delete("/:serviceId", serviceController.deleteService);

module.exports = router;
