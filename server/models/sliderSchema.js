const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    linkUrl: { type: String, default: "/shop-all" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider", sliderSchema);
