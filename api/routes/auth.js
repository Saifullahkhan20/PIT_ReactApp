const express = require('express');
const router = express.Router();
const { forgotPassword } = require('../controllers/authController');

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

module.exports = router; 