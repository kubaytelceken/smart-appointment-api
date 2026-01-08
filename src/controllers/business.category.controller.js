const businessService = require("../services/business.category.service");

/**
 * ADMIN - Tüm kategoriler
 */
const getBusinessCategories = async (req, res) => {
  try {
    const categories = await businessService.getBusinessCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kategoriler getirilemedi" });
  }
};

/**
 * PUBLIC - Sadece aktif kategoriler
 */
const getBusinessCategoriesWithActives = async (req, res) => {
  try {
    const categories =
      await businessService.getBusinessCategoriesWithActives();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Aktif kategoriler getirilemedi" });
  }
};

/**
 * ADMIN - Create
 */
const createBusinessCategory = async (req, res) => {
  try {
    const { code, name, description, icon, status, order } = req.body;

    const category = await businessService.createBusinessCategory({
      code,
      name,
      description,
      icon,
      status,
      order,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error.message === "INVALID_STATUS") {
      return res.status(400).json({ error: "Geçersiz durum" });
    }

    if (error.message === "CATEGORY_CODE_ALREADY_EXISTS") {
      return res
        .status(409)
        .json({ error: "Bu koda ait kategori zaten mevcut" });
    }

    console.error(error);
    res.status(500).json({ error: "Kategori oluşturulamadı" });
  }
};

/**
 * ADMIN - Update
 */
const updateBusinessCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, icon, status, order } = req.body;

    const category = await businessService.updateBusinessCategory({
      id,
      code,
      name,
      description,
      icon,
      status,
      order,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error.message === "INVALID_STATUS") {
      return res.status(400).json({ error: "Geçersiz durum" });
    }

    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ error: "Kategori bulunamadı" });
    }

    if (error.message === "CATEGORY_CODE_ALREADY_EXISTS") {
      return res
        .status(409)
        .json({ error: "Bu koda ait kategori zaten mevcut" });
    }

    console.error(error);
    res.status(500).json({ error: "Kategori güncellenemedi" });
  }
};

/**
 * ADMIN - Soft Delete
 */
const deleteBusinessCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await businessService.deleteBusinessCategory(id);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ error: "Kategori bulunamadı" });
    }

    console.error(error);
    res.status(500).json({ error: "Kategori silinemedi" });
  }
};

module.exports = {
  getBusinessCategories,
  getBusinessCategoriesWithActives,
  createBusinessCategory,
  updateBusinessCategory,
  deleteBusinessCategory,
};
