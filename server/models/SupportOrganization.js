const mongoose = require("mongoose");

const supportOrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add an organization name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    governmentLevel: {
      type: String,
      enum: ["Central", "State", "Local", "NGO", "Private"],
      default: "NGO",
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    helpline: {
      type: String,
      required: [true, "Please add a helpline number"],
    },
    address: {
      type: String,
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "SupportOrganization",
  supportOrganizationSchema,
);
