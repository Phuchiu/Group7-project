const express = require('express');
const { signup, login, refreshAccessToken, logout, revokeAllTokens } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.post('/revoke-all', auth, revokeAllTokens);

module.exports = router;