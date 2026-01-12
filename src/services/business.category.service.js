const { BusinessCategory } = require("../models");
const { Op } = require("sequelize");

const ALLOWED_STATUSES = ["active", "passive", "banned"];

/**
 * ADMIN - Tüm kategoriler
 */
const getBusinessCategories = async () => {
  return await BusinessCategory.findAll({
    order: [
      ["order", "ASC"]
    ]
  });
};

/**
 * PUBLIC - Sadece aktif kategoriler
 */
const getBusinessCategoriesWithActives = async () => {
  return await BusinessCategory.findAll({
    where: { status: "active" },
    attributes: ["id", "name", "icon"],
    order: [
      ["order", "ASC"]
    ]
  });
};

/**
 * ADMIN - Create
 */
const createBusinessCategory = async ({
  code,
  name,
  description,
  icon,
  status = "active",
  order
}) => {
  // status kontrolü
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new Error("INVALID_STATUS");
  }

  // duplicate code kontrolü
  const exists = await BusinessCategory.findOne({
    where: { code }
  });

  if (exists) {
    throw new Error("CATEGORY_CODE_ALREADY_EXISTS");
  }

  const category = await BusinessCategory.create({
    code,
    name,
    description,
    icon,
    status,
    order
  });

  return category;
};

/**
 * ADMIN - Update
 */
const updateBusinessCategory = async ({
  id,
  code,
  name,
  description,
  icon,
  status,
  order
}) => {
  const category = await BusinessCategory.findByPk(id);

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (status && !ALLOWED_STATUSES.includes(status)) {
    throw new Error("INVALID_STATUS");
  }

  // code değiştiriliyorsa duplicate kontrolü
  if (code && code !== category.code) {
    const exists = await BusinessCategory.findOne({
      where: {
        code,
        id: { [Op.ne]: id }
      }
    });

    if (exists) {
      throw new Error("CATEGORY_CODE_ALREADY_EXISTS");
    }
  }

  await category.update({
    code,
    name,
    description,
    icon,
    status,
    order
  });

  return category;
};

/**
 * ADMIN - Soft Delete
 */
const deleteBusinessCategory = async (id) => {
  const category = await BusinessCategory.findByPk(id);

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (category.status === "passive") {
    return category; // zaten pasif
  }

  await category.update({ status: "passive" });

  return category;
};

module.exports = {
  getBusinessCategories,
  getBusinessCategoriesWithActives,
  createBusinessCategory,
  updateBusinessCategory,
  deleteBusinessCategory
};
