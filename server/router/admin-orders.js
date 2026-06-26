const express = require("express");
const router = express.Router();
const Order = require("../models/orderSchema");
const { protectAdmin } = require("../middleware/authMiddleware");

// ✅ Get all orders for admin
router.get("/", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")          // ensure user exists
      .populate("items.product", "name image price returnDays") 
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

  if (!["Pending", "Paid", "Packing", "Dispatched", "Delivered", "Cancelled", "Return_Requested", "Returned"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.status;

    // Check if status is transitioning to Cancelled or Returned from a non-cancelled/returned status
    if (["Cancelled", "Returned"].includes(status) && !["Cancelled", "Returned"].includes(previousStatus)) {
      if (order.coinsUsed > 0 || order.coinsEarned > 0) {
        const User = require("../models/userSchema");
        const coinAdjust = order.coinsUsed - order.coinsEarned;
        if (coinAdjust !== 0) {
          await User.updateOne(
            { _id: order.user },
            { $inc: { cashbackCoins: coinAdjust } }
          );
          const updatedUser = await User.findById(order.user);
          if (updatedUser && updatedUser.cashbackCoins < 0) {
            updatedUser.cashbackCoins = 0;
            await updatedUser.save();
          }
        }
      }
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name image price returnDays")
      .populate("address_id");

    res.json({ order: updatedOrder });
  } catch (err) {
    console.error("Admin update order error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;
