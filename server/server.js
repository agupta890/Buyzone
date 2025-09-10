require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Import Routers
const authRouter = require('./router/auth-router');
const productRoutes = require('./router/products-route');
const paymentRoutes = require('./router/payments-route');
const ordersRouter = require('./router/orders-route');
const cartRouter = require('./router/cart-router');
// <<<<<<< main
// const addressRouter = require("./router/address-route");
// const cookieParser = require("cookie-parser");
// =======
// const adminOrdersRoutes = require('./router/admin-orders');
// >>>>>>> main

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes); 
app.use('/api/orders', ordersRouter);
app.use("/api/cart", cartRouter);
// <<<<<<< main
// app.use("/api/address", addressRouter);
// =======
// app.use("/api/admin/orders", adminOrdersRoutes);

// // ✅ Default Route
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // ✅ Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Server Error' });
// });
// >>>>>>> main

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
