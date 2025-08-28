const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const authRouter = require('./router/auth-router');
const productRoutes = require('./router/products-route');
const paymentRoutes = require('./router/payments-route');
const ordersRouter = require('./router/orders-route');



connectDB(); // Connect to MongoDB

// Enable CORS
 app.use(cors({
   origin: ['http://localhost:5173', 'http://localhost:3000'],
   credentials: true
 }));
app.use(express.json());

// Use the router
app.use('/api/auth', authRouter);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes); 
app.use('/api/orders', ordersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
