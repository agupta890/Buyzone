const mongoose = require('mongoose');
// Importing mongoose to define the schema for the Product model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  stock: { type: Number, default: 0 },
}, { timestamps: true });
module.exports=mongoose.model('Product', productSchema);
