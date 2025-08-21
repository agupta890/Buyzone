const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true }, // e.g. "home-decor"
  subcategory: { type: String }, // e.g. "Bedsheet"
  stock: { type: Number, default: 0 },
});

module.exports = mongoose.model("Product", productSchema);
