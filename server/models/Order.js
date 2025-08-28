const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: { type: Array, default: [] }, 
  total: { type: Number, required: true },
  payment_method: { type: String },
  payment_id: { type: String },
  order_id: { type: String },
  signature: { type: String },
  status: { type: String, default: 'Pending' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
