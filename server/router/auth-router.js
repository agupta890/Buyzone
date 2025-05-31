const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/auth-controller");

router.route("/").get(authcontroller.home);
router.route("/register").post(authcontroller.register);
router.route("/login").get(authcontroller.login);

module.exports = router;
