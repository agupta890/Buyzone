const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// 🔹 Protect any logged-in user
const protectUser = async (req, res, next) => {
  try {
    let token;

    // 1. Check cookie first
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // 2. Or Authorization header
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 4. Fetch user and exclude password
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 5. Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);

    // Handle expired token separately
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }

    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// // 🔹 Admin-only Middleware
// const adminOnly = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     return next();
//   }
//   return res.status(403).json({ message: "Access denied: Admins only" });
// };


const protectAdmin = async (req, res, next) => {
  try {
    // Expect token in Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT safely
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Token is invalid or malformed" });
    }

    // Fetch user and check admin role
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    req.user = user; // attach admin user to req
    next();

  } catch (err) {
    console.error("protectAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// Example protectUser middleware
exports.protectUser = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
};


module.exports = { protectUser,protectAdmin};
