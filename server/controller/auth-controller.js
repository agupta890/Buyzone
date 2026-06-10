const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userSchema");

// Google OAuth client (used to validate that an access token was issued for our app)
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
//login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Account created via Google has no local password
    if (!existingUser.password) {
      return res
        .status(400)
        .json({ message: "This account uses Google Sign-In. Please continue with Google." });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT
    const token = generateToken(existingUser._id);

    // Set cookie
    setTokenCookie(res, token);

    // Respond with role included
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role || "user", // 👈 Important: send role
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// 🔹 Google Sign-In / Sign-Up
// Frontend sends a Google access token. We verify it was issued for OUR app,
// fetch the verified Google profile, then log the user in (creating the
// account on first sign-in). Existing email/password accounts are linked.
const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: "Missing Google access token" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is not configured on the server");
      return res.status(500).json({ message: "Google login is not configured" });
    }

    // 1. Verify the access token's audience matches our app (prevents token replay
    //    from other Google apps), and that it hasn't expired.
    let tokenInfo;
    try {
      tokenInfo = await googleClient.getTokenInfo(access_token);
    } catch (err) {
      console.error("Google token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired Google token" });
    }

    if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Google token audience mismatch" });
    }

    // 2. Fetch the verified profile (name / picture) from Google's userinfo endpoint.
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileRes.ok) {
      return res.status(401).json({ message: "Failed to fetch Google profile" });
    }

    const profile = await profileRes.json();
    const email = (profile.email || tokenInfo.email || "").toLowerCase();
    const googleId = profile.sub || tokenInfo.sub;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Google account has no usable email" });
    }

    // 3. Find an existing user by email, or create a new Google-based account.
    let user = await User.findOne({ email });

    if (user) {
      // Link Google to an existing (e.g. password-based) account if not linked yet.
      let changed = false;
      if (!user.googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (!user.avatar && profile.picture) {
        user.avatar = profile.picture;
        changed = true;
      }
      if (changed) await user.save();
    } else {
      user = await User.create({
        name: profile.name || email.split("@")[0],
        email,
        googleId,
        avatar: profile.picture || "",
        authProvider: "google",
        // no password — this account authenticates via Google
      });
    }

    // 4. Issue the same JWT cookie used by the email/password flow.
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Google login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google login failed" });
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

// Promote a user to admin (protected by ADMIN_SETUP_SECRET)
const makeAdmin = async (req, res) => {
  try {
    const { email, secret } = req.body;
    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      return res.status(403).json({ message: "Invalid secret" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "User is already an admin" });
    user.role = "admin";
    await user.save();
    res.json({ message: `${user.name} (${user.email}) is now an admin` });
  } catch (err) {
    console.error("makeAdmin error:", err);
    res.status(500).json({ message: "Failed to promote user" });
  }
};

module.exports = {
  home,
  getMe,
  register,
  login,
  googleAuth,
  logout,
  makeAdmin,
};
