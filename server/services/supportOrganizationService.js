const SupportOrganization = require("../models/SupportOrganization");

const getAllOrganizations = async (filters = {}) => {
  let query = {};

  if (filters.governmentLevel) {
    query.governmentLevel = filters.governmentLevel;
  }

  if (filters.isVerified !== undefined) {
    query.isVerified = filters.isVerified;
  }

  if (filters.location) {
    query.location = { $regex: filters.location, $options: "i" };
  }

  return await SupportOrganization.find(query).sort({ createdAt: -1 });
};

const getOrganizationById = async (id) => {
  return await SupportOrganization.findById(id);
};

const createOrganization = async (organizationData) => {
  return await SupportOrganization.create(organizationData);
};

const updateOrganization = async (id, updateData) => {
  return await SupportOrganization.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteOrganization = async (id) => {
  const organization = await SupportOrganization.findById(id);
  if (!organization) {
    throw new Error("Organization not found");
  }
  await organization.deleteOne();
  return { message: "Organization deleted successfully" };
};

const getGovernmentOrganizations = async () => {
  return await SupportOrganization.find({
    governmentLevel: { $in: ["Central", "State", "Local"] },
  }).sort({ name: 1 });
};

const getNGOOrganizations = async () => {
  return await SupportOrganization.find({ governmentLevel: "NGO" }).sort({
    name: 1,
  });
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getGovernmentOrganizations,
  getNGOOrganizations,
};
