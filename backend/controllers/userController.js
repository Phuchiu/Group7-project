const User = require('../models/User');

// Get all users (CRUD + Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      message: 'Lấy danh sách người dùng thành công',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Create user (CRUD)
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const user = new User({ name, email, password: '123456' });
    await user.save();
    
    res.status(201).json({
      message: 'Tạo người dùng thành công',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Update user (CRUD)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json({
      message: 'Cập nhật người dùng thành công',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Delete user (CRUD + Admin RBAC)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Check if user can delete
    if (currentUser.role !== 'admin' && currentUser._id.toString() !== id) {
      return res.status(403).json({ message: 'Bạn chỉ có thể xóa tài khoản của chính mình' });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Prevent deleting last admin
    if (userToDelete.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Không thể xóa admin cuối cùng' });
      }
    }

    await User.findByIdAndDelete(id);
    
    res.json({
      message: `Đã xóa người dùng ${userToDelete.name} thành công`,
      deletedUser: {
        id: userToDelete._id,
        name: userToDelete.name,
        email: userToDelete.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Get user stats (Admin)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });

    res.json({
      totalUsers,
      adminCount,
      userCount,
      message: 'Thống kê người dùng'
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
};