const serviceService = require("../services/service.service");

// CREATE
const createService = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const {
      business_id,
      name,
      description,
      duration_minutes,
      price,
      is_online_bookable,
      status,
    } = req.body;

    const service = await serviceService.createService(ownerId, {
      business_id,
      name,
      description,
      duration_minutes,
      price,
      is_online_bookable,
      status,
    });

    return res.status(201).json(service);
  } catch (error) {
    if (error.message === "BUSINESS_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "CREATE_SERVICE_ERROR" });
  }
};

// GET SERVICE BY ID
const getServiceById = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { serviceId } = req.params;

    const service = await serviceService.getServiceById(ownerId, serviceId);
    return res.json(service);
  } catch (error) {
    if (
      error.message === "SERVICE_NOT_FOUND" ||
      error.message === "FORBIDDEN"
    ) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "GET_SERVICE_ERROR" });
  }
};

// GET BUSINESS SERVICES
const getBusinessServices = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { businessId } = req.params;

    const services = await serviceService.getBusinessServices(
      ownerId,
      businessId
    );

    return res.json(services);
  } catch (error) {
    if (error.message === "BUSINESS_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "GET_BUSINESS_SERVICES_ERROR" });
  }
};

// UPDATE
const updateService = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { serviceId } = req.params;

    const {
      name,
      description,
      duration_minutes,
      price,
      is_online_bookable,
      status,
    } = req.body;

    const service = await serviceService.updateService(ownerId, serviceId, {
      name,
      description,
      duration_minutes,
      price,
      is_online_bookable,
      status,
    });

    return res.json(service);
  } catch (error) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "UPDATE_SERVICE_ERROR" });
  }
};

// DELETE (SOFT)
const deleteService = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { serviceId } = req.params;

    await serviceService.deleteService(ownerId, serviceId);

    return res.status(204).send();
  } catch (error) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "DELETE_SERVICE_ERROR" });
  }
};

module.exports = {
  createService,
  getServiceById,
  getBusinessServices,
  updateService,
  deleteService,
};
