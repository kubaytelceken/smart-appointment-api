const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 🔐 Tüm appointment route'ları auth korumalı
router.use(authMiddleware);

/**
 * USER
 */

// CREATE appointment
router.post("/", appointmentController.createAppointment);

// GET my appointments
router.get("/my", appointmentController.getMyAppointments);

/**
 * BUSINESS / OWNER
 */

// GET business appointments
router.get(
  "/business/:businessId",
  appointmentController.getBusinessAppointments
);

// APPROVE appointment
router.patch(
  "/:id/approve",
  appointmentController.approveAppointment
);

// COMPLETE appointment
router.patch(
  "/:id/complete",
  appointmentController.completeAppointment
);

// CANCEL appointment (user or owner)
router.patch(
  "/:id/cancel",
  appointmentController.cancelAppointment
);

module.exports = router;
