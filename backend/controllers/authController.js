const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '5m' });
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
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    
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

module.exports = { signup, login, refreshAccessToken, logout, revokeAllTokens };