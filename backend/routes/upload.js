const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { auth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/avatar', auth, upload.single('avatar'), uploadController.uploadAvatar);

module.exports = router;