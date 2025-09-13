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
     .populate("items.product", "name image price")
     .populate("address_id")
    .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});



module.exports = router;
