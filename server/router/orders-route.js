const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/authMiddleware");
const Order = require("../models/orderSchema");

// ✅ Create new order
router.post("/", protectUser, async (req, res) => {
  try {
    const { items, total, address_id } = req.body; 
    const coinsUsed = Number(req.body.coinsUsed) || 0;

    if (!address_id) {
      return res.status(400).json({ error: "Delivery address is required" });
    }

    // Verify user has enough coins if they used them
    if (coinsUsed > 0) {
      if (req.user.cashbackCoins < coinsUsed) {
        return res.status(400).json({ error: "Insufficient cashback coins" });
      }
    }

    // Load active offer to calculate coins earned
    const CashbackOffer = require("../models/cashbackOfferSchema");
    const offer = await CashbackOffer.findOne().sort({ updatedAt: -1 });
    let coinsEarned = 0;

    if (offer && offer.isActive) {
      const orderTotal = total || 0;
      if (orderTotal >= offer.maxPurchase) {
        coinsEarned = Math.round(orderTotal * (offer.maxCashbackPercent / 100));
      } else if (orderTotal >= offer.midPurchase) {
        coinsEarned = Math.round(orderTotal * (offer.midCashbackPercent / 100));
      } else if (orderTotal >= offer.minPurchase) {
        coinsEarned = Math.round(orderTotal * (offer.minCashbackPercent / 100));
      }
    }

    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
      address_id,   // 👈 save address reference
      coinsUsed,
      coinsEarned,
      payment_method: total === 0 ? "Wallet" : "COD",
      status: total === 0 ? "Paid" : "Pending",
    });

    await newOrder.save();

    // Deduct coins used & add coins earned to user account
    if (coinsUsed > 0 || coinsEarned > 0) {
      const User = require("../models/userSchema");
      await User.updateOne(
        { _id: req.user.id },
        { $inc: { cashbackCoins: coinsEarned - coinsUsed } }
      );
    }

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

    // Revert cashback coins
    if (order.coinsUsed > 0 || order.coinsEarned > 0) {
      const User = require("../models/userSchema");
      const coinAdjust = order.coinsUsed - order.coinsEarned;
      if (coinAdjust !== 0) {
        await User.updateOne(
          { _id: req.user.id },
          { $inc: { cashbackCoins: coinAdjust } }
        );
        const updatedUser = await User.findById(req.user.id);
        if (updatedUser && updatedUser.cashbackCoins < 0) {
          updatedUser.cashbackCoins = 0;
          await updatedUser.save();
        }
      }
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
