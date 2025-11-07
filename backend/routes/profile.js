const express = require('express');
const multer = require('multer');
const path = require('path');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Multer config for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('avatar'), updateProfile);

module.exports = router;