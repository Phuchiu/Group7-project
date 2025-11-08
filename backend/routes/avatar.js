const express = require('express');
const { uploadAvatar, deleteAvatar, getAvatarInfo } = require('../controllers/avatarController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Upload avatar
router.post('/upload', auth, uploadLimiter, upload.single('avatar'), uploadAvatar);

// Delete avatar
router.delete('/delete', auth, deleteAvatar);

// Get avatar info
router.get('/info', auth, getAvatarInfo);

module.exports = router;