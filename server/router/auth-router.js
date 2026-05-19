const express = require("express");
const { login, register, getMe, logout, makeAdmin } = require("../controller/auth-controller");
const { protectUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectUser, getMe);
router.post("/make-admin", makeAdmin);

module.exports = router;
