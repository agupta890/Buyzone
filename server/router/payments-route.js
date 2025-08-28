
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const Order = require('../models/Order'); 

require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order (frontend sends amount in rupees)
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receiptMeta } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // convert ₹ -> paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
      notes: receiptMeta || {},
    };

    const order = await razorpay.orders.create(options);

    // return order and public key_id to the frontend
    res.json({ order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment & persist order
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, total } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Missing payment fields' });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Invalid signature' });
    }

    // Signature valid — create order in DB
    const newOrder = new Order({
      items: cart || [],
      total: total || 0,
      payment_method: 'RAZORPAY',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      signature: razorpay_signature,
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
