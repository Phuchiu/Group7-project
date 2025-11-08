const express = require('express');
const { signup, login, refreshAccessToken, logout, revokeAllTokens, forgotPassword, resetPassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { loginLimiter, generalLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/signup', generalLimiter, signup);
router.post('/login', loginLimiter, login);
router.post('/refresh', generalLimiter, refreshAccessToken);
router.post('/logout', auth, logout);
router.post('/revoke-all', auth, revokeAllTokens);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password/:token', generalLimiter, resetPassword);

module.exports = router;