const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    const userId = req.user._id;
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `avatar_${userId}_${Date.now()}${fileExtension}`;
    const avatarUrl = `/uploads/${fileName}`;

    // Save file to uploads directory
    const uploadPath = path.join(__dirname, '../uploads', fileName);
    fs.writeFileSync(uploadPath, req.file.buffer);

    // Update user avatar URL in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Upload avatar thành công',
      avatar: avatarUrl,
      user: updatedUser
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ 
      message: 'Lỗi upload avatar', 
      error: error.message 
    });
  }
};

// Delete avatar
const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Delete file from uploads directory
    if (user.avatar) {
      const filePath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove avatar URL from database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: '' },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Xóa avatar thành công',
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi xóa avatar', 
      error: error.message 
    });
  }
};

// Get avatar info
const getAvatarInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('avatar name email');
    
    res.json({
      message: 'Lấy thông tin avatar thành công',
      avatar: user.avatar,
      hasAvatar: !!user.avatar
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi lấy thông tin avatar', 
      error: error.message 
    });
  }
};

module.exports = {
  uploadAvatar,
  deleteAvatar,
  getAvatarInfo
};