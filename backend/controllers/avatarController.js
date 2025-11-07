const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    const userId = req.user._id;

    // Resize image using Sharp
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'avatars',
          public_id: `avatar_${userId}`,
          overwrite: true,
          transformation: [
            { width: 300, height: 300, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(resizedImageBuffer);
    });

    // Update user avatar URL in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResult.secure_url },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Upload avatar thành công',
      avatar: uploadResult.secure_url,
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

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(`avatars/avatar_${userId}`);
    } catch (cloudinaryError) {
      console.log('Cloudinary delete error:', cloudinaryError.message);
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