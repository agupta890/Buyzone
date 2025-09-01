const express = require("express");
const { login, register, getMe, logout } = require("../controller/auth-controller");
const { protectUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectUser, getMe);

module.exports = router;
