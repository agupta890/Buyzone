const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const Order = require('../models/orderSchema');
const {protectUser} = require('../middleware/authMiddleware'); // make sure you have auth

require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  
});


// Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    if (!amount || isNaN(amount)) return res.status(400).json({ error: "Invalid amount" });

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      order,
      key_id: process.env.RAZORPAY_KEY_ID, // 🔑 send public key for frontend
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});


// Verify payment & save order
router.post('/verify',protectUser, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, total,address_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Missing payment fields' });
    }

     if (!address_id) {
      return res
        .status(400)
        .json({ verified: false, error: "Delivery address is required" });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Invalid signature' });
    }

    const coinsUsed = Number(req.body.coinsUsed) || 0;

    // Verify user has enough coins if they used them
    if (coinsUsed > 0) {
      if (req.user.cashbackCoins < coinsUsed) {
        return res.status(400).json({ verified: false, error: 'Insufficient cashback coins' });
      }
    }

    // Load active offer to calculate coins earned
    const CashbackOffer = require('../models/cashbackOfferSchema');
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

    // Format cart items for DB
    const formattedCart = (cart || []).map(item => ({
      product: item.product._id || item.product,
      quantity: item.quantity || 1,
      price: item.price || item.product.price || 0,
    }));

    const newOrder = new Order({
      user: req.user._id,
      items: formattedCart,
      total: total || 0,
      payment_method: 'RAZORPAY',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      signature: razorpay_signature,
      address_id: address_id,
      coinsUsed: coinsUsed,
      coinsEarned: coinsEarned,
      status: 'Paid',
    });

    await newOrder.save();

    // Deduct coins used & add coins earned to user account
    if (coinsUsed > 0 || coinsEarned > 0) {
      const User = require('../models/userSchema');
      await User.updateOne(
        { _id: req.user._id },
        { $inc: { cashbackCoins: coinsEarned - coinsUsed } }
      );
    }

    // 🛒 Clear user's cart after successful order - using a more robust update
    try {
      const Cart = require('../models/cartSchema');
      await Cart.updateOne(
        { user: req.user._id },
        { $set: { items: [] } }
      );
    } catch (cartErr) {
      console.error("Error clearing cart in verify route:", cartErr);
    }

    res.json({ verified: true, orderId: newOrder._id });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ verified: false, error: 'Verification failed' });
  }
});

module.exports = router;
