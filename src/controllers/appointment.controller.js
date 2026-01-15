const appointmentService = require("../services/appointment.service");

/**
 * CREATE APPOINTMENT (USER)
 * POST /appointments
 */
const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointment = await appointmentService.createAppointment(
      userId,
      req.body
    );

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * GET MY APPOINTMENTS (USER)
 * GET /appointments/my
 */
const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await appointmentService.getMyAppointments(userId);

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET BUSINESS APPOINTMENTS (OWNER)
 * GET /appointments/business/:businessId
 */
const getBusinessAppointments = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { businessId } = req.params;

    const appointments = await appointmentService.getBusinessAppointments(
      ownerId,
      businessId
    );

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * APPROVE APPOINTMENT (OWNER)
 * PATCH /appointments/:id/approve
 */
const approveAppointment = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const appointment = await appointmentService.approveAppointment(
      ownerId,
      id
    );

    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * COMPLETE APPOINTMENT (OWNER)
 * PATCH /appointments/:id/complete
 */
const completeAppointment = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const appointment = await appointmentService.completeAppointment(
      ownerId,
      id
    );

    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * CANCEL APPOINTMENT (USER or OWNER)
 * PATCH /appointments/:id/cancel
 */
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await appointmentService.cancelAppointment(
      req.user.id,
      id
    );

    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: err.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getBusinessAppointments,
  approveAppointment,
  completeAppointment,
  cancelAppointment,
};
