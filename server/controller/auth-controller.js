const bcrypt = require("bcryptjs");
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

// Registration controller
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

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Login controller
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

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  home,
  register,
  login
};