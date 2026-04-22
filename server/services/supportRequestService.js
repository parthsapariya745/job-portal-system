const SupportRequest = require("../models/SupportRequest");
const SupportCategory = require("../models/SupportCategory");

const createRequest = async (requestData) => {
  const { categoryId } = requestData;

  // Verify category exists
  const category = await SupportCategory.findById(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  const supportRequest = await SupportRequest.create({
    ...requestData,
    status: "Pending",
  });

  return await SupportRequest.findById(supportRequest._id)
    .populate("categoryId", "name slug icon");
};

const getAllRequests = async (filters = {}, page = 1, limit = 20) => {
  let query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const requests = await SupportRequest.find(query)
    .populate("categoryId", "name slug icon")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await SupportRequest.countDocuments(query);

  return {
    requests,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  };
};

const getRequestById = async (id) => {
  return await SupportRequest.findById(id)
    .populate("categoryId", "name slug icon description");
};

const updateRequestStatus = async (id, status) => {
  const request = await SupportRequest.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    },
  ).populate("categoryId", "name slug icon");

  if (!request) {
    throw new Error("Request not found");
  }

  return request;
};

const getRequestStats = async () => {
  const stats = await SupportRequest.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await SupportRequest.countDocuments();

  return { total, stats };
};

const getRecentRequests = async (limit = 5) => {
  return await SupportRequest.find()
    .populate("categoryId", "name slug icon")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  getRequestStats,
  getRecentRequests,
};
