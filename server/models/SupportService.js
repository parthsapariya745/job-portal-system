const mongoose = require("mongoose");

const supportServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a service title"],
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "SupportCategory",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please add a service description"],
    },
    organizationId: {
      type: mongoose.Schema.ObjectId,
      ref: "SupportOrganization",
      required: true,
    },
    serviceType: {
      type: String,
      required: [true, "Please add a service type"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    requirements: {
      type: String,
      required: [true, "Please add requirements"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SupportService", supportServiceSchema);
