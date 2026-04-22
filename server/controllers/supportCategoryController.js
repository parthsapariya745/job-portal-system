const SupportCategory = require("../models/SupportCategory");
const SupportService = require("../models/SupportService");
const SupportOrganization = require("../models/SupportOrganization");
const SupportRequest = require("../models/SupportRequest");

// @desc    Get all support categories
// @route   GET /api/support/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await SupportCategory.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single support category
// @route   GET /api/support/categories/:id
// @access  Public
const getCategory = async (req, res) => {
  try {
    const category = await SupportCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new support category
// @route   POST /api/support/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const category = await SupportCategory.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update support category
// @route   PATCH /api/support/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const category = await SupportCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete support category
// @route   DELETE /api/support/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await SupportCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has services
    const servicesCount = await SupportService.countDocuments({
      categoryId: req.params.id,
    });

    if (servicesCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with existing services",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get category stats (service count)
// @route   GET /api/support/categories/:id/stats
// @access  Public
const getCategoryStats = async (req, res) => {
  try {
    const category = await SupportCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const serviceCount = await SupportService.countDocuments({
      categoryId: req.params.id,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        category,
        serviceCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
};
