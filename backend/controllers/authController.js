const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { logActivity, logFailedActivity } = require('../middleware/activityLogger');
const { sendResetPasswordEmail } = require('../services/emailService');

const generateAccessToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const refreshToken = new RefreshToken({
    token,
    userId,
    expiresAt
  });
  
  await refreshToken.save();
  return token;
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    
    // Log signup activity
    await logActivity(user._id, 'SIGNUP', `New user registered: ${email}`, req);
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      accessToken,
      refreshToken,
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Log failed login
      await logFailedActivity('LOGIN_FAILED', `Failed login attempt for: ${email}`, req, { email });
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    
    // Log successful login
    await logActivity(user._id, 'LOGIN_SUCCESS', `User logged in: ${email}`, req);
    
    res.json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
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

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token không được cung cấp' });
    }

    const tokenDoc = await RefreshToken.findOne({ 
      token: refreshToken,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!tokenDoc) {
      return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(tokenDoc.userId._id);
    
    res.json({
      message: 'Làm mới token thành công',
      accessToken: newAccessToken,
      user: {
        id: tokenDoc.userId._id,
        name: tokenDoc.userId.name,
        email: tokenDoc.userId.email,
        role: tokenDoc.userId.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await RefreshToken.updateOne(
        { token: refreshToken },
        { isRevoked: true }
      );
    }
    
    // Log logout activity
    const userId = req.user?._id;
    if (userId) {
      await logActivity(userId, 'LOGOUT', 'User logged out', req);
    }
    
    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const revokeAllTokens = async (req, res) => {
  try {
    const userId = req.user._id;
    
    await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
    
    res.json({ message: 'Tất cả token đã bị thu hồi' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code directly (no hashing for simplicity)
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send email with OTP code
    const emailSent = await sendResetPasswordEmail(email, resetCode);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Lỗi server: Không thể gửi email' });
    }
    
    res.json({ message: 'Mã xác nhận đã được gửi đến email' });
  } catch (error) {
    console.error('LỖI GỬI MAIL CHI TIẾT:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    console.log('👉 [DEBUG] Frontend gửi lên:', { email, code });

    // 1. Tìm user bằng email trước (bỏ qua check token vội)
    const user = await User.findOne({ email });

    if (!user) {
        console.log('❌ [DEBUG] Không tìm thấy user có email này');
        return res.status(400).json({ message: 'Email không tồn tại' });
    }

    // 2. In ra thông tin đang lưu trong DB để so sánh
    console.log('👉 [DEBUG] Dữ liệu trong DB:', {
        tokenInDB: user.resetPasswordToken,
        expireInDB: user.resetPasswordExpires,
        currentTime: Date.now(),
        isMatch: user.resetPasswordToken === code,
        isStillValid: user.resetPasswordExpires > Date.now()
    });

    // 3. Kiểm tra thủ công
    if (user.resetPasswordToken !== code) {
         return res.status(400).json({ message: 'Mã xác nhận không khớp!' });
    }
    if (user.resetPasswordExpires <= Date.now()) {
         return res.status(400).json({ message: 'Mã xác nhận đã hết hạn!' });
    }

    // 4. Nếu mọi thứ OK thì lưu mật khẩu mới
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công!' });
  } catch (error) {
    console.error('LỖI RESET PASSWORD:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Verify token for Redux - kiểm tra token có hợp lệ không
const verifyToken = async (req, res) => {
  try {
    // Middleware auth đã verify token và gán user vào req.user
    res.json({
      message: 'Token hợp lệ',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { signup, login, refreshAccessToken, logout, revokeAllTokens, forgotPassword, resetPassword, verifyToken };