const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    image: { type: String, default: "" },
    icon: { type: String, default: "ShoppingBag" },
    color: { type: String, default: "from-amber-500 to-orange-400" },
    subcategories: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
