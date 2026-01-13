const { Service, Business } = require("../models");

// CREATE
const createService = async (ownerId, serviceModel) => {
  const business = await Business.findOne({
    where: {
      id: serviceModel.business_id,
      owner_id: ownerId,
    },
  });

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const service = await Service.create({
    business_id: serviceModel.business_id,
    name: serviceModel.name,
    description: serviceModel.description,
    duration_minutes: serviceModel.duration_minutes,
    price: serviceModel.price,
    is_online_bookable: serviceModel.is_online_bookable,
    status: serviceModel.status ?? "active",
  });

  return service;
};

// GET SERVICE BY ID
const getServiceById = async (ownerId, serviceId) => {
  const service = await Service.findOne({
    where: { id: serviceId },
    include: [
      {
        model: Business,
        where: { owner_id: ownerId },
        attributes: [],
      },
    ],
  });

  if (!service) {
    throw new Error("SERVICE_NOT_FOUND");
  }

  return service;
};

// GET BUSINESS SERVICES
const getBusinessServices = async (ownerId, businessId) => {
  const business = await Business.findOne({
    where: {
      id: businessId,
      owner_id: ownerId,
    },
  });

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const services = await Service.findAll({
    where: {
      business_id: businessId,
      status: "active",
    },
    order: [["created_at", "DESC"]],
  });

  return services;
};

// UPDATE
const updateService = async (ownerId, serviceId, updateModel) => {
  const service = await Service.findOne({
    where: { id: serviceId },
    include: [
      {
        model: Business,
        where: { owner_id: ownerId },
        attributes: [],
      },
    ],
  });

  if (!service) {
    throw new Error("SERVICE_NOT_FOUND");
  }

  await service.update({
    name: updateModel.name,
    description: updateModel.description,
    duration_minutes: updateModel.duration_minutes,
    price: updateModel.price,
    is_online_bookable: updateModel.is_online_bookable,
    status: updateModel.status,
  });

  return service;
};

// DELETE (SOFT)
const deleteService = async (ownerId, serviceId) => {
  const service = await Service.findOne({
    where: { id: serviceId },
    include: [
      {
        model: Business,
        where: { owner_id: ownerId },
        attributes: [],
      },
    ],
  });

  if (!service) {
    throw new Error("SERVICE_NOT_FOUND");
  }

  if (service.status === "passive") {
    return service;
  }

  await service.update({ status: "passive" });

  return service;
};

module.exports = {
  createService,
  getServiceById,
  getBusinessServices,
  updateService,
  deleteService,
};
