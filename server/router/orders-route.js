 const express = require('express');
 const router = express.Router();
 // If you have an Order mongoose model, require it. Replace path/name as needed.
 let Order;
 try {
   Order = require('../models/Order'); // ensure this file exists and exports mongoose model
 } catch (e) {
   // No model found — we'll fall back to mock data below
   Order = null;
 }

 // GET /api/orders
 router.get('/', async (req, res) => {
   try {
     if (Order) {
       // If you use auth middleware that sets req.userId, filter by user: req.userId
       // Example: const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
       const orders = await Order.find().sort({ createdAt: -1 }).lean();
       return res.json(orders);
     }

     // fallback mock data for testing
     const mock = [
       {
         _id: '1',
         items: [{ name: 'Test product', quantity: 1, price: 199 }],
         total: 199,
         status: 'Delivered',
         created_at: new Date()
       }
     ];
     return res.json(mock);
   } catch (err) {
     console.error('GET /api/orders error:', err);
     return res.status(500).json({ error: 'Server error' });
   }
 });

 module.exports = router;
