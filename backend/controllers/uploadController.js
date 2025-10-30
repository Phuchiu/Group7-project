const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Cập nhật avatar cho user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Upload avatar thành công',
      avatarUrl,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware upload
exports.uploadMiddleware = upload.single('avatar');

// Upload avatar với URL (không cần file)
exports.updateAvatarUrl = async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    
    if (!avatarUrl) {
      return res.status(400).json({ message: 'Avatar URL là bắt buộc' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Cập nhật avatar thành công',
      avatarUrl,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};