const express = require('express');
const { uploadAvatar, deleteAvatar, getAvatarInfo } = require('../controllers/avatarController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Upload avatar with error handling
router.post('/upload', auth, uploadLimiter, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File quá lớn (tối đa 5MB)' });
      }
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, uploadAvatar);

// Delete avatar
router.delete('/delete', auth, deleteAvatar);

// Get avatar info
router.get('/info', auth, getAvatarInfo);

// Test route for debugging
router.get('/test', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(__dirname, '../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    return res.json({ 
      error: 'Uploads directory does not exist',
      path: uploadsDir
    });
  }
  
  const files = fs.readdirSync(uploadsDir);
  res.json({ 
    uploadsDir,
    files,
    message: 'Avatar system working',
    staticUrl: '/uploads/'
  });
});

module.exports = router;