const mongoose = require("mongoose");

const supportContactSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.ObjectId,
      ref: "SupportOrganization",
      required: true,
    },
    helpline: {
      type: String,
      required: [true, "Please add a helpline number"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SupportContact", supportContactSchema);
