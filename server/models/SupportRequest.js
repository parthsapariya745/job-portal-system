const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Please add your age"],
      min: [1, "Age must be at least 1"],
      max: [120, "Age must be less than 120"],
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "SupportCategory",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description of your request"],
    },
    location: {
      type: String,
      required: [true, "Please add your location"],
    },
    contactNumber: {
      type: String,
      required: [true, "Please add a contact number"],
      match: [/^[0-9]{10}$/, "Please add a valid 10-digit phone number"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Approved", "Rejected", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SupportRequest", supportRequestSchema);
