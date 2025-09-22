// backend/config/db.js - Simple Version
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connections[0].readyState) {
      console.log('✅ MongoDB already connected');
      return;
    }

    // Simple connection - Mongoose 8.x handles most optimization automatically
    const conn = await mongoose.connect(process.env.MONGO_URI);
   
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;