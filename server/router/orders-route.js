const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/authMiddleware");
const Order = require("../models/orderSchema");

// ✅ Create new order
router.post("/", protectUser, async (req, res) => {
  try {
    const { items, total } = req.body;

    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
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
     .populate("items.product", "name image price")
    .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
