const businessService = require("../services/business.service");

/**
 * CREATE
 */
const createBusiness = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name } = req.body;

   if (!name) {
      return res.status(400).json({
        error: "NAME_REQUIRED",
      });
    }

    const business = await businessService.createBusiness({
      ownerId,
      ...req.body,
    });

    return res.status(201).json({ business });
  } catch (err) {
    if (err.message === "PLAN_NOT_FOUND") {
      return res.status(500).json({ error: "FREE_PLAN_NOT_CONFIGURED" });
    }

    console.error("Create business error:", err);
    return res.status(500).json({ error: "CREATE_BUSINESS_FAILED" });
  }
};

/**
 * GET MY BUSINESSES
 */
const getMyBusinesses = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const businesses = await businessService.getMyBusinesses(ownerId);

    return res.json({ businesses });
  } catch (err) {
    console.error("Get my businesses error:", err);
    return res.status(500).json({ error: "GET_MY_BUSINESSES_FAILED" });
  }
};

/**
 * GET BY ID (PUBLIC)
 */
const getBusinessById = async (req, res) => {
  try {
    const { businessId } = req.params;

    const business = await businessService.getBusinessById(businessId);

    return res.json({ business });
  } catch (err) {
    if (err.message === "BUSINESS_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }

    console.error("Get business error:", err);
    return res.status(500).json({ error: "GET_BUSINESS_FAILED" });
  }
};

/**
 * UPDATE
 */
const updateBusiness = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { businessId } = req.params;

    const business = await businessService.updateBusiness({
      ownerId,
      businessId,
      ...req.body,
    });

    return res.json({ business });
  } catch (err) {
    if (
      err.message === "BUSINESS_NOT_FOUND" ||
      err.message === "FORBIDDEN"
    ) {
      return res.status(403).json({ error: err.message });
    }

    console.error("Update business error:", err);
    return res.status(500).json({ error: "UPDATE_BUSINESS_FAILED" });
  }
};

/**
 * DELETE (SOFT)
 */
const deleteBusiness = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { businessId } = req.params;

    await businessService.deleteBusiness(ownerId, businessId);

    return res.json({ success: true });
  } catch (err) {
    if (
      err.message === "BUSINESS_NOT_FOUND" ||
      err.message === "FORBIDDEN"
    ) {
      return res.status(403).json({ error: err.message });
    }

    console.error("Delete business error:", err);
    return res.status(500).json({ error: "DELETE_BUSINESS_FAILED" });
  }
};

module.exports = {
  createBusiness,
  getMyBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
};
