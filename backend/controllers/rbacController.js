const User = require('../models/User');

// Get user permissions based on role
const getUserPermissions = (req, res) => {
  const { role } = req.user;
  
  const permissions = {
    user: [
      'read_own_profile',
      'update_own_profile',
      'delete_own_account'
    ],
    moderator: [
      'read_own_profile',
      'update_own_profile', 
      'delete_own_account',
      'read_all_users',
      'update_user_profile',
      'moderate_content'
    ],
    admin: [
      'read_own_profile',
      'update_own_profile',
      'delete_own_account', 
      'read_all_users',
      'create_user',
      'update_user_profile',
      'delete_user',
      'manage_roles',
      'view_statistics',
      'moderate_content',
      'system_settings'
    ]
  };

  res.json({
    message: 'Lấy quyền người dùng thành công',
    role,
    permissions: permissions[role] || []
  });
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role không hợp lệ' });
    }

    // Prevent changing last admin
    if (role !== 'admin') {
      const targetUser = await User.findById(userId);
      if (targetUser.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({ message: 'Không thể thay đổi role của admin cuối cùng' });
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json({
      message: `Đã cập nhật role thành ${role}`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Get role statistics
const getRoleStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const roleStats = {
      admin: 0,
      moderator: 0,
      user: 0
    };

    stats.forEach(stat => {
      roleStats[stat._id] = stat.count;
    });

    res.json({
      message: 'Thống kê role thành công',
      stats: roleStats,
      total: Object.values(roleStats).reduce((a, b) => a + b, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Moderator actions
const moderatorActions = {
  // View user details (Moderator can view, but not edit sensitive info)
  viewUserDetails: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      res.json({
        message: 'Lấy thông tin người dùng thành công',
        user,
        viewedBy: {
          id: req.user._id,
          name: req.user.name,
          role: req.user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Update user profile (Moderator can update basic info)
  updateUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      res.json({
        message: 'Cập nhật thông tin người dùng thành công',
        user: updatedUser,
        updatedBy: {
          id: req.user._id,
          name: req.user.name,
          role: req.user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};

module.exports = {
  getUserPermissions,
  updateUserRole,
  getRoleStats,
  moderatorActions
};