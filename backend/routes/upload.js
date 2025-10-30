const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');

router.post('/upload-avatar', 
  authenticate, 
  uploadController.uploadMiddleware, 
  uploadController.uploadAvatar
);

router.put('/avatar-url', authenticate, uploadController.updateAvatarUrl);

module.exports = router;