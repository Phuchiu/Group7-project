const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');

class TokenService {
  // Generate Access Token (short-lived)
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
    });
  }

  // Generate Refresh Token (long-lived)
  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
    });
  }

  // Verify Access Token
  verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  // Verify Refresh Token
  verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }

  // Save Refresh Token to database
  async saveRefreshToken(userId, token) {
    const refreshToken = new RefreshToken({
      token,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    return await refreshToken.save();
  }

  // Find Refresh Token in database
  async findRefreshToken(token) {
    return await RefreshToken.findOne({ 
      token, 
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId');
  }

  // Revoke Refresh Token
  async revokeRefreshToken(token) {
    return await RefreshToken.updateOne(
      { token },
      { isRevoked: true }
    );
  }

  // Revoke all user's refresh tokens
  async revokeAllUserTokens(userId) {
    return await RefreshToken.updateMany(
      { userId },
      { isRevoked: true }
    );
  }

  // Generate token pair
  async generateTokenPair(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Save refresh token to database
    await this.saveRefreshToken(user._id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
    };
  }
}

module.exports = new TokenService();