require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();

// ========================
// CONNECT DATABASE
// ========================
connectDB();

// ========================
// CORS CONFIG (MUST BE FIRST)
// ========================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://buyzone-p1r5.vercel.app",
  "https://buyzoneindia.netlify.app",
  "https://buyzone-frontend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle Preflight Requests
app.options("*", cors());

// ========================
// OTHER MIDDLEWARES
// ========================

app.use(cookieParser());

// ✅ Update CORS for production
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    // Add your frontend Vercel URL when deployed
    'https://buyzone-p1r5.vercel.app',
    'https://buyzoneindia.netlify.app'
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================
// ROUTES IMPORT
// ========================

const authRouter = require("./router/auth-router");
const productRoutes = require("./router/products-route");
const paymentRoutes = require("./router/payments-route");
const ordersRouter = require("./router/orders-route");
const cartRouter = require("./router/cart-router");
const adminOrdersRoutes = require("./router/admin-orders");
const addressRoutes = require("./router/address-route");

// ========================
// ROUTES
// ========================

app.use("/api/auth", authRouter);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", ordersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/admin/orders", adminOrdersRoutes);
app.use("/api/address", addressRoutes);

// ========================
// HEALTH CHECK
// ========================

app.get("/", (req, res) => {
  res.json({
    message: "API is running successfully 🚀",
    status: "OK",
    time: new Date().toISOString(),
  });
});

// ========================
// 404 HANDLER
// ========================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ========================
// ERROR HANDLER
// ========================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ========================
// SERVER START
// ========================

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
