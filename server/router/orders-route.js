const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/authMiddleware");
const Order = require("../models/orderSchema");

// ✅ Create new order
// ✅ Create new order
router.post("/", protectUser, async (req, res) => {
  try {
    const { items, total, address_id } = req.body; 

    if (!address_id) {
      return res.status(400).json({ error: "Delivery address is required" });
    }

    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
      address_id,   // 👈 save address reference
      status: "Pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});


// ✅ Get all orders of the logged-in user
router.get("/", protectUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
     .populate("items.product", "name image price returnDays")
     .populate("address_id")
    .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});



// Cancel order (user can cancel if Pending, Paid, or Packing)
router.patch("/:id/cancel", protectUser, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (!['Pending', 'Paid', 'Packing'].includes(order.status)) {
      return res.status(400).json({ error: "Order cannot be cancelled at this stage" });
    }

    order.status = 'Cancelled';
    order.cancellation_reason = req.body.reason || '';
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

// Request return (user can request return only for Delivered orders)
router.patch("/:id/return", protectUser, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status !== 'Delivered') {
      return res.status(400).json({ error: "Only delivered orders can be returned" });
    }

    order.status = 'Return_Requested';
    order.return_reason = req.body.reason || '';
    await order.save();

    res.json({ message: "Return requested successfully", order });
  } catch (err) {
    console.error("Return order error:", err);
    res.status(500).json({ error: "Failed to request return" });
  }
});

module.exports = router;
