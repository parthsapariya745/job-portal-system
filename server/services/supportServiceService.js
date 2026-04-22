const SupportService = require("../models/SupportService");

const getAllServices = async (filters = {}) => {
  let query = { isActive: true };

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  if (filters.location) {
    query.location = { $regex: filters.location, $options: "i" };
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ];
  }

  return await SupportService.find(query)
    .populate("categoryId", "name slug icon")
    .populate("organizationId", "name helpline email website governmentLevel")
    .sort({ createdAt: -1 });
};

const getServiceById = async (id) => {
  return await SupportService.findById(id)
    .populate("categoryId", "name slug icon description")
    .populate(
      "organizationId",
      "name description helpline email website address location governmentLevel",
    );
};

const getServicesByCategory = async (categoryId) => {
  const SupportCategory = require("../models/SupportCategory");

  const category = await SupportCategory.findById(categoryId);
  if (!category) {
    throw new Error("Category not found");
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

  return { category, services };
};

const createService = async (serviceData) => {
  const service = await SupportService.create(serviceData);
  return await SupportService.findById(service._id)
    .populate("categoryId", "name slug icon")
    .populate("organizationId", "name helpline email website");
};

const updateService = async (id, updateData) => {
  return await SupportService.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("categoryId", "name slug icon")
    .populate("organizationId", "name helpline email website");
};

const deleteService = async (id) => {
  const service = await SupportService.findById(id);
  if (!service) {
    throw new Error("Service not found");
  }
  await service.deleteOne();
  return { message: "Service deleted successfully" };
};

module.exports = {
  getAllServices,
  getServiceById,
  getServicesByCategory,
  createService,
  updateService,
  deleteService,
};
