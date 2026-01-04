const { Business, BusinessCategory } = require("../models");
const slugify = require("slugify");

/**
 * CREATE
 */
const createBusiness = async ({
  ownerId,
  name,
  category_id,
  description,
  phone,
  address,
  location_lat,
  location_lng,
}) => {
  const category = await BusinessCategory.findByPk(category_id);
  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
  });

  const uniqueSlug = `${baseSlug}-${Date.now()}`;

  const business = await Business.create({
    owner_id: ownerId,
    category_id,
    name,
    slug: uniqueSlug,
    description,
    phone,
    address,
    location_lat,
    location_lng,
    status: "active",
  });

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
  location_lat,
  location_lng,
}) => {
  const business = await Business.findByPk(businessId);

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  if (business.owner_id !== ownerId) {
    throw new Error("FORBIDDEN");
  }

  await business.update({
    description,
    phone,
    address,
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

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  if (business.owner_id !== ownerId) {
    throw new Error("FORBIDDEN");
  }

  await business.destroy();
};

module.exports = {
  createBusiness,
  getMyBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
};
