require("dotenv").config({override: true});
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cookieParser());

// ✅ Update CORS for production
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    // Add your frontend Vercel URL when deployed
    'https://buyzone-p1r5.vercel.app'
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Import Routers
const authRouter = require('./router/auth-router');
const productRoutes = require('./router/products-route');
const paymentRoutes = require('./router/payments-route');
const ordersRouter = require('./router/orders-route');
const cartRouter = require('./router/cart-router');
const adminOrdersRoutes = require('./router/admin-orders');
const addressRoutes = require("./router/address-route");

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes); 
app.use('/api/orders', ordersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/admin/orders", adminOrdersRoutes);
app.use("/api/address", addressRoutes);

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running on Vercel!', 
    status: 'success',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// ✅ API Status Route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API endpoints are working!',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/products', 
      '/api/payments',
      '/api/orders',
      '/api/cart',
      '/api/admin/orders',
      '/api/address'
    ]
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ✅ For Vercel, don't use app.listen in production
const PORT = process.env.PORT || 3000;

// Only listen if NOT running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app; // Export for Vercel


// ✅ Export for Vercel
module.exports = app;