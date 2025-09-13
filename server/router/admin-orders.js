const express = require("express");
const router = express.Router();
const Order = require("../models/orderSchema");
const { protectAdmin } = require("../middleware/authMiddleware");

// ✅ Get all orders for admin
router.get("/", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name image price")
      .populate("address_id")
      .sort({ createdAt: -1 });

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

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("items.product", "name image price");

    res.json({ order: updatedOrder });
  } catch (err) {
    console.error("Admin update order error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;
