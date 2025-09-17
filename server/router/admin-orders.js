const express = require("express");
const router = express.Router();
const Order = require("../models/orderSchema");
const { protectAdmin } = require("../middleware/authMiddleware");

// ✅ Get all orders for admin
router.get("/", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")          // ensure user exists
      .populate("items.product", "name image price") 
      .populate("address_id")                       // make sure address exists in DB
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.json({ orders: [] }); // empty array instead of null
    }

    res.json({ orders });
  } catch (err) {
    console.error("Admin fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ Update order status
router.patch("/:id", protectAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Packing", "Dispatched", "Delivered", "Cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("items.product", "name image price")
      .populate("address_id");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order: updatedOrder });
  } catch (err) {
    console.error("Admin update order error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;
