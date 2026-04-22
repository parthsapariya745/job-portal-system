const SupportService = require("../models/SupportService");
const SupportCategory = require("../models/SupportCategory");
const SupportOrganization = require("../models/SupportOrganization");

// @desc    Get all support services
// @route   GET /api/support/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { categoryId, location, search } = req.query;

    let query = { isActive: true };

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const services = await SupportService.find(query)
      .populate("categoryId", "name slug icon")
      .populate("organizationId", "name helpline email website governmentLevel")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single support service
// @route   GET /api/support/services/:id
// @access  Public
const getService = async (req, res) => {
  try {
    const service = await SupportService.findById(req.params.id)
      .populate("categoryId", "name slug icon description")
      .populate(
        "organizationId",
        "name description helpline email website address location governmentLevel",
      );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get services by category
// @route   GET /api/support/services/category/:categoryId
// @access  Public
const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Verify category exists
    const category = await SupportCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const services = await SupportService.find({
      categoryId,
      isActive: true,
    })
      .populate("categoryId", "name slug icon")
      .populate(
        "organizationId",
        "name helpline email website governmentLevel",
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new support service
// @route   POST /api/support/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const service = await SupportService.create(req.body);

    const populatedService = await SupportService.findById(service._id)
      .populate("categoryId", "name slug icon")
      .populate("organizationId", "name helpline email website");

    res.status(201).json({
      success: true,
      data: populatedService,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update support service
// @route   PATCH /api/support/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const service = await SupportService.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("categoryId", "name slug icon")
      .populate("organizationId", "name helpline email website");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete support service
// @route   DELETE /api/support/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await SupportService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getServices,
  getService,
  getServicesByCategory,
  createService,
  updateService,
  deleteService,
};
