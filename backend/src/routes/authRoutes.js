const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// ලියාපදිංචි වීමේ මාර්ගය (POST /api/v1/auth/register)
router.post('/register', registerUser);

// ඇතුළත් වීමේ මාර්ගය (POST /api/v1/auth/login)
router.post('/login', loginUser);

module.exports = router;