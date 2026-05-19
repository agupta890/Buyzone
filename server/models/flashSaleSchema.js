const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["all", "category", "product"], required: true },
    target: { type: String, default: "" },     // category slug or product _id; empty for "all"
    targetName: { type: String, default: "" }, // human-readable display name
    discount: { type: Number, required: true, min: 1, max: 99 },
  },
  { _id: true }
);

const flashSaleSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: false },
    label: { type: String, default: "Flash Sale" },
    endsAt: { type: Date, default: null },
    rules: [ruleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlashSale", flashSaleSchema);
