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
    
    // Convert buffer to base64
    const fileBuffer = req.file.buffer;
    const base64Data = fileBuffer.toString('base64');
    const mimeType = req.file.mimetype;
    const avatarData = `data:${mimeType};base64,${base64Data}`;
    
    console.log('Avatar uploaded:', req.file.originalname);
    console.log('File size:', fileBuffer.length, 'bytes');
    console.log('MIME type:', mimeType);

    // Update user avatar with base64 data in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarData },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Upload avatar thành công',
      avatar: avatarData,
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

    // Remove avatar data from database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: null },
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