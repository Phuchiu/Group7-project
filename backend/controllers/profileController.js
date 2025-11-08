const User = require('../models/User');
const { logActivity } = require('../middleware/logger');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      message: 'Lấy thông tin profile thành công',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Check if email already exists (exclude current user)
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã được sử dụng bởi người khác' });
      }
    }

    const updateData = { name, email };
    
    // Handle avatar upload
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    await logActivity(userId, 'UPDATE_PROFILE', 'User updated profile', req);

    res.json({
      message: 'Cập nhật profile thành công',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile
};