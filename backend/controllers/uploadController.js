const { cloudinary } = require('../config/cloudinary');
const User = require('../models/User');

// Upload Avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary (mock for now)
    const avatarUrl = `https://via.placeholder.com/150?text=${req.user.name}`;
    
    // Update user avatar
    const user = await User.findById(req.user.id);
    user.avatar = avatarUrl;
    await user.save();

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mock Cloudinary upload (for testing without real Cloudinary account)
const mockCloudinaryUpload = (buffer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        secure_url: `https://via.placeholder.com/150?text=Avatar_${Date.now()}`
      });
    }, 1000);
  });
};