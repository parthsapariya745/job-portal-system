const SupportRequest = require("../models/SupportRequest");
const SupportCategory = require("../models/SupportCategory");

// @desc    Create new help request
// @route   POST /api/support/request
// @access  Public
const createRequest = async (req, res) => {
  try {
    const { name, age, categoryId, description, location, contactNumber } = req.body;

    // Verify category exists
    const category = await SupportCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const supportRequest = await SupportRequest.create({
      name,
      age,
      categoryId,
      description,
      location,
      contactNumber,
      status: "Pending",
    });

    const populatedRequest = await SupportRequest.findById(supportRequest._id)
      .populate("categoryId", "name slug icon");

    res.status(201).json({
      success: true,
      message: "Help request submitted successfully. We will contact you soon.",
      data: populatedRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all help requests
// @route   GET /api/support/requests
// @access  Private/Admin
const getRequests = async (req, res) => {
  try {
    const { status, categoryId, page = 1, limit = 20 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await SupportRequest.find(query)
      .populate("categoryId", "name slug icon")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SupportRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single help request
// @route   GET /api/support/request/:id
// @access  Private/Admin
const getRequest = async (req, res) => {
  try {
    const request = await SupportRequest.findById(req.params.id)
      .populate("categoryId", "name slug icon description");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update help request status
// @route   PATCH /api/support/request/status/:id
// @access  Private/Admin
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status",
      });
    }

    const request = await SupportRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    ).populate("categoryId", "name slug icon");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get request stats
// @route   GET /api/support/requests/stats
// @access  Private/Admin
const getRequestStats = async (req, res) => {
  try {
    const stats = await SupportRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRequests = await SupportRequest.countDocuments();

    res.status(200).json({
      success: true,
      total: totalRequests,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequest,
  updateRequestStatus,
  getRequestStats,
};
