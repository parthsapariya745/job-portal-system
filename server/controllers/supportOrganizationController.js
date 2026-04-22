const SupportOrganization = require("../models/SupportOrganization");

// @desc    Get all support organizations
// @route   GET /api/support/organizations
// @access  Public
const getOrganizations = async (req, res) => {
  try {
    const { governmentLevel, isVerified, location } = req.query;

    let query = {};

    if (governmentLevel) {
      query.governmentLevel = governmentLevel;
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === "true";
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const organizations = await SupportOrganization.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single support organization
// @route   GET /api/support/organizations/:id
// @access  Public
const getOrganization = async (req, res) => {
  try {
    const organization = await SupportOrganization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new support organization
// @route   POST /api/support/organizations
// @access  Private/Admin
const createOrganization = async (req, res) => {
  try {
    const organization = await SupportOrganization.create(req.body);

    res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update support organization
// @route   PATCH /api/support/organizations/:id
// @access  Private/Admin
const updateOrganization = async (req, res) => {
  try {
    const organization = await SupportOrganization.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete support organization
// @route   DELETE /api/support/organizations/:id
// @access  Private/Admin
const deleteOrganization = async (req, res) => {
  try {
    const organization = await SupportOrganization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    await organization.deleteOne();

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
