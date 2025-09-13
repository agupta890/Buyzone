const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Home page controller
const home = async (req, res) => {
  try {
    res.status(200).json({ message: "Hello from the server" });
  } catch (error) {
    console.error("Home route error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get current logged-in user from token
const getMe = async (req, res) => {
  try {
    res.json({ user: req.user }); // req.user comes from middleware
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Helper to set cookie securely
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, // https only in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ allow frontend-backend cross origin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// 🔹 Registration (User only)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: user._id, name, email, role: "user" },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// 🔹 Login (User only for now)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(existingUser._id);

    // ✅ set cookie for backend usage
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  home,
  getMe,
  register,
  login,
  logout,
};
