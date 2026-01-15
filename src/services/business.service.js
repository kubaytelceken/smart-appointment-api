const { Business } = require("../models");
const slugify = require("slugify");
const userSubscriptionService = require("./userSubscription.service");
const subscriptionPlanService = require("./subscriptionPlan.service");

/**
 * CREATE
 */
const createBusiness = async ({
  ownerId,
  name,
  description,
  phone,
  address,
  country,
  city,
  district,
  postal_code,
  location_lat,
  location_lng,
}) => {
  const baseSlug = slugify(name, { lower: true, strict: true });
  const uniqueSlug = `${baseSlug}-${Date.now()}`;

  const business = await Business.create({
    owner_id: ownerId,
    name,
    slug: uniqueSlug,
    description,
    phone,
    address,
    country,
    city,
    district,
    postal_code,
    location_lat,
    location_lng,
    status: "active",
  });

  // ⭐ Free subscription ata
  const freePlan = await subscriptionPlanService.getPlanByCode("FREE");
  await userSubscriptionService.createSubscription(business.id, freePlan.id);

  return business;
};

/**
 * GET MY BUSINESSES
 */
const getMyBusinesses = async (ownerId) => {
  return await Business.findAll({
    where: { owner_id: ownerId },
    order: [["created_at", "DESC"]],
  });
};

/**
 * GET BY ID (PUBLIC)
 */
const getBusinessById = async (businessId) => {
  const business = await Business.findByPk(businessId);

  if (!business || business.status !== "active") {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  return business;
};

/**
 * UPDATE
 */
const updateBusiness = async ({
  ownerId,
  businessId,
  description,
  phone,
  address,
  country,
  city,
  district,
  postal_code,
  location_lat,
  location_lng,
}) => {
  const business = await Business.findByPk(businessId);

  if (!business) throw new Error("BUSINESS_NOT_FOUND");
  if (business.owner_id !== ownerId) throw new Error("FORBIDDEN");

  await business.update({
    description,
    phone,
    address,
    country,
    city,
    district,
    postal_code,
    location_lat,
    location_lng,
  });

  return business;
};

/**
 * DELETE (SOFT)
 */
const deleteBusiness = async (ownerId, businessId) => {
  const business = await Business.findByPk(businessId);

  if (!business) throw new Error("BUSINESS_NOT_FOUND");
  if (business.owner_id !== ownerId) throw new Error("FORBIDDEN");

  await business.destroy();
};

module.exports = {
  createBusiness,
  getMyBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
};