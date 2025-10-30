const User = require('../models/User');

// GET: lấy tất cả users (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      message: 'Lấy danh sách người dùng thành công',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: xóa user (Admin hoặc tự xóa)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    
    // Kiểm tra quyền: Admin hoặc tự xóa tài khoản
    if (currentUser.role !== 'admin' && currentUser._id.toString() !== id) {
      return res.status(403).json({ 
        message: 'Bạn chỉ có thể xóa tài khoản của chính mình' 
      });
    }
    
    // Không cho phép xóa chính mình nếu là admin duy nhất
    if (currentUser._id.toString() === id && currentUser.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ 
          message: 'Không thể xóa admin cuối cùng trong hệ thống' 
        });
      }
    }
    
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.json({ 
      message: `Đã xóa người dùng ${deletedUser.name} thành công`,
      deletedUser: {
        _id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: thống kê users (Admin only)
exports.getUserStats = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};