const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true, index: true }, // Added index
  subcategory: { type: String, index: true }, // Added index
  stock: { type: Number, default: 0 },
  description: { type: String, default: "" },
  isBestsellers: { type: Boolean, default: false, index: true } // Added index
}, { 
  strict: false, // Allows saving fields not explicitly in the schema
  timestamps: true 
});

// Force refresh the model in case of caching
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

module.exports = mongoose.model("Product", productSchema);
