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
      status: 'Paid',
    });

    await newOrder.save();
    res.json({ verified: true, orderId: newOrder._id });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ verified: false, error: 'Verification failed' });
  }
});

module.exports = router;
