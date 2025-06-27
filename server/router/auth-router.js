const express = require('express');
const router = express.Router();
const { home, register, login } = require('../controller/auth-controller');

// Route mappings
router.get('/', home);
router.post('/register', register);
router.post('/login', login);

module.exports = router;