const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const authRouter = require('./router/auth-router');

connectDB(); // Connect to MongoDB

// Enable CORS
app.use(cors({ origin:'http://localhost:5173',credentials: true }));
app.use(express.json());

// Use the router
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
