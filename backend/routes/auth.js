const express = require('express');
const { signup, login, refreshAccessToken, logout, revokeAllTokens, forgotPassword, resetPassword, verifyToken } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { loginLimiter, generalLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/signup', generalLimiter, signup);
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshAccessToken);
router.get('/verify', auth, verifyToken); // Route mới cho Redux
router.post('/logout', auth, logout);
router.post('/revoke-all', auth, revokeAllTokens);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;