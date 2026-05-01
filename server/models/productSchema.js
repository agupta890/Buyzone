const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true, index: true }, // Added index
  subcategory: { type: String, index: true }, // Added index
  stock: { type: Number, default: 0 },
  isBestsellers: { type: Boolean, default: false, index: true } // Added index
});

module.exports = mongoose.model("Product", productSchema);
