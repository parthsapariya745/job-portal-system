const SupportCategory = require("../models/SupportCategory");

const getAllCategories = async () => {
  return await SupportCategory.find({ isActive: true }).sort({ createdAt: -1 });
};

const getCategoryById = async (id) => {
  return await SupportCategory.findById(id);
};

const createCategory = async (categoryData) => {
  return await SupportCategory.create(categoryData);
};

const updateCategory = async (id, updateData) => {
  return await SupportCategory.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteCategory = async (id) => {
  const category = await SupportCategory.findById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  await category.deleteOne();
  return { message: "Category deleted successfully" };
};

const getCategoryStats = async (id) => {
  const SupportService = require("../models/SupportService");
  const category = await SupportCategory.findById(id);
  if (!category) {
    throw new Error("Category not found");
  }

  const serviceCount = await SupportService.countDocuments({
    categoryId: id,
    isActive: true,
  });

  return { category, serviceCount };
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
};
