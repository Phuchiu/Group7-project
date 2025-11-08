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

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save file to uploads directory
    const uploadPath = path.join(uploadsDir, fileName);
    fs.writeFileSync(uploadPath, req.file.buffer);
    console.log('Avatar saved to:', uploadPath);
    console.log('Avatar URL:', avatarUrl);

    // Delete old avatar if exists
    const user = await User.findById(userId);
    if (user.avatar) {
      // Validate avatar path to prevent path traversal
      const avatarFileName = path.basename(user.avatar);
      const oldAvatarPath = path.resolve(uploadsDir, avatarFileName);
      
      // Ensure the path is within uploads directory
      if (oldAvatarPath.startsWith(path.resolve(uploadsDir)) && fs.existsSync(oldAvatarPath)) {
        try {
          fs.unlinkSync(oldAvatarPath);
        } catch (err) {
          console.log('Could not delete old avatar:', err.message);
        }
      }
    }

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

    // Delete file from uploads directory with path validation
    if (user.avatar) {
      const uploadsDir = path.resolve(__dirname, '../uploads');
      const avatarFileName = path.basename(user.avatar);
      const filePath = path.resolve(uploadsDir, avatarFileName);
      
      // Ensure the path is within uploads directory to prevent path traversal
      if (filePath.startsWith(uploadsDir) && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.log('Could not delete avatar file:', err.message);
        }
      }
    }

    // Remove avatar URL from database
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