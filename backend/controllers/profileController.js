const User = require('../models/User');

// Xem thông tin cá nhân
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Tên và email là bắt buộc' });
    }
    
    // Kiểm tra email trùng lặp (trừ user hiện tại)
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.user.id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    const updateData = { name, email };
    if (avatar) updateData.avatar = avatar;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Cập nhật thông tin thành công',
      user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
    res.status(500).json({ message: error.message });
  }
};