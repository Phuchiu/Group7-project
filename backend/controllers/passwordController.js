const User = require('../models/User');
const crypto = require('crypto');

// Forgot Password - gửi token reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email là bắt buộc' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy email này' });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút
    
    await user.save();

    // Trong thực tế sẽ gửi email, ở đây chỉ trả về token để test
    res.json({
      message: 'Token reset password đã được tạo',
      resetToken, // Chỉ để test, thực tế không trả về
      email: user.email,
      expiresIn: '10 phút'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password với token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token và mật khẩu mới là bắt buộc' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    
    await user.save();

    res.json({
      message: 'Đổi mật khẩu thành công',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};