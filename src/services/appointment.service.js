const { Appointment, Business, Service } = require("../models");
const { Op } = require("sequelize");

/**
 * CREATE APPOINTMENT (USER)
 */
const createAppointment = async (userId, appointmentModel) => {
  // business var mı?
  const business = await Business.findOne({
    where: {
      id: appointmentModel.business_id,
      status: "active",
    },
  });

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  // service gerçekten bu business'a mı ait?
  const service = await Service.findOne({
    where: {
      id: appointmentModel.service_id,
      business_id: appointmentModel.business_id,
      status: "active",
      is_online_bookable: true,
    },
  });

  if (!service) {
    throw new Error("SERVICE_NOT_FOUND");
  }

  // geçmiş tarih kontrolü
  const today = new Date();
  const appointmentDate = new Date(appointmentModel.appointment_date);

  if (appointmentDate < new Date(today.toDateString())) {
    throw new Error("PAST_DATE_NOT_ALLOWED");
  }

  // saat çakışma kontrolü
  const conflict = await Appointment.findOne({
    where: {
      business_id: appointmentModel.business_id,
      appointment_date: appointmentModel.appointment_date,
      status: {
        [Op.in]: ["pending", "approved"],
      },
      [Op.or]: [
        {
          start_time: {
            [Op.lt]: appointmentModel.end_time,
          },
          end_time: {
            [Op.gt]: appointmentModel.start_time,
          },
        },
      ],
    },
  });

  if (conflict) {
    throw new Error("APPOINTMENT_TIME_CONFLICT");
  }

  const appointment = await Appointment.create({
    user_id: userId,
    business_id: appointmentModel.business_id,
    service_id: appointmentModel.service_id,
    appointment_date: appointmentModel.appointment_date,
    start_time: appointmentModel.start_time,
    end_time: appointmentModel.end_time,
    note: appointmentModel.note,
    status: "pending",
  });

  return appointment;
};

/**
 * GET USER APPOINTMENTS
 */
const getMyAppointments = async (userId) => {
  const appointments = await Appointment.findAll({
    where: {
      user_id: userId,
    },
    order: [
      ["appointment_date", "DESC"],
      ["start_time", "DESC"],
    ],
  });

  return appointments;
};

/**
 * GET BUSINESS APPOINTMENTS (OWNER)
 */
const getBusinessAppointments = async (ownerId, businessId) => {
  const business = await Business.findOne({
    where: {
      id: businessId,
      owner_id: ownerId,
    },
  });

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const appointments = await Appointment.findAll({
    where: {
      business_id: businessId,
    },
    order: [
      ["appointment_date", "ASC"],
      ["start_time", "ASC"],
    ],
  });

  return appointments;
};

/**
 * APPROVE APPOINTMENT (OWNER)
 */
const approveAppointment = async (ownerId, appointmentId) => {
  const appointment = await Appointment.findOne({
    where: { id: appointmentId },
    include: [
      {
        model: Business,
        where: { owner_id: ownerId },
        attributes: [],
      },
    ],
  });

  if (!appointment) {
    throw new Error("APPOINTMENT_NOT_FOUND");
  }

  if (appointment.status !== "pending") {
    throw new Error("APPOINTMENT_STATUS_NOT_ALLOWED");
  }

  await appointment.update({ status: "approved" });

  return appointment;
};

/**
 * COMPLETE APPOINTMENT (OWNER)
 */
const completeAppointment = async (ownerId, appointmentId) => {
  const appointment = await Appointment.findOne({
    where: { id: appointmentId },
    include: [
      {
        model: Business,
        where: { owner_id: ownerId },
        attributes: [],
      },
    ],
  });

  if (!appointment) {
    throw new Error("APPOINTMENT_NOT_FOUND");
  }

  if (appointment.status !== "approved") {
    throw new Error("APPOINTMENT_STATUS_NOT_ALLOWED");
  }

  await appointment.update({ status: "completed" });

  return appointment;
};

/**
 * CANCEL APPOINTMENT (USER or OWNER)
 */
const cancelAppointment = async (appointmentId, actor) => {
  const appointment = await Appointment.findOne({
    where: { id: appointmentId },
    include: [
      {
        model: Business,
        attributes: ["owner_id"],
      },
    ],
  });

  if (!appointment) {
    throw new Error("APPOINTMENT_NOT_FOUND");
  }

  const isOwner = appointment.Business.owner_id === actor.id;
  const isUser = appointment.user_id === actor.id;

  if (!isOwner && !isUser) {
    throw new Error("FORBIDDEN");
  }

  if (["cancelled", "completed", "no_show"].includes(appointment.status)) {
    return appointment;
  }

  await appointment.update({ status: "cancelled" });

  return appointment;
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getBusinessAppointments,
  approveAppointment,
  completeAppointment,
  cancelAppointment,
};
