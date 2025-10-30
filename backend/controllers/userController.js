const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET: lấy profile của user hiện tại
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT: cập nhật profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cập nhật các field
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (password) user.password = password; // sẽ được hash bởi pre-save middleware

    const updatedUser = await user.save();
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET: lấy tất cả users (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: xóa user (Admin hoặc tự xóa)
exports.deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUser = req.user;
    
    // Kiểm tra quyền: admin hoặc tự xóa
    if (currentUser.role !== 'admin' && currentUser.id !== targetUserId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndDelete(targetUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};