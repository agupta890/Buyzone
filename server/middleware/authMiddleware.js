const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// 🔹 Protect any logged-in user
const protectUser = async (req, res, next) => {
  try {
    let token;

    // 1. Prefer cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // 2. Or fallback to Authorization header
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

    // 4. Fetch user (without password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 5. Attach to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }

    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// 🔹 Protect admin-only routes
const protectAdmin = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("protectAdmin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { protectUser, protectAdmin };
