const crypto = require('crypto');

class TokenGenerator {
  // Generate secure reset token
  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate verification token
  static generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
  }

  // Generate API key
  static generateApiKey() {
    return crypto.randomBytes(24).toString('hex');
  }

  // Hash token for storage
  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Generate token with expiry
  static generateTokenWithExpiry(expiryHours = 1) {
    const token = this.generateResetToken();
    const expires = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    
    return {
      token,
      expires,
      expiresIn: `${expiryHours} hour${expiryHours > 1 ? 's' : ''}`
    };
  }

  // Validate token format
  static isValidTokenFormat(token) {
    // Check if token is 64 characters hex string
    return /^[a-f0-9]{64}$/i.test(token);
  }

  // Check if token is expired
  static isTokenExpired(expiryDate) {
    return new Date() > new Date(expiryDate);
  }

  // Generate secure random string
  static generateSecureString(length = 32) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }
}

module.exports = TokenGenerator;