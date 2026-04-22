const mongoose = require("mongoose");
const slugify = require("slugify");

const supportCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      trim: true,
      unique: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a category description"],
    },
    icon: {
      type: String,
      default: "default-category.png",
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

supportCategorySchema.pre("save", function (next) {
  if (!this.isModified("name")) {
    next();
    return;
  }
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("SupportCategory", supportCategorySchema);
