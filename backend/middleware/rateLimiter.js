const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { logFailedActivity } = require('./activityLogger');

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Quá nhiều requests từ IP này, vui lòng thử lại sau 15 phút',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
});

// Strict login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    error: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút',
    retryAfter: '15 minutes',
    attempts: 5
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
  handler: async (req, res) => {
    // Log rate limit hit
    await logFailedActivity(
      'RATE_LIMIT_HIT', 
      'Login rate limit exceeded', 
      req,
      { 
        limit: 5,
        windowMs: 15 * 60 * 1000,
        endpoint: '/api/auth/login'
      }
    );
    
    res.status(429).json({
      error: 'Quá nhiều lần đăng nhập thất bại',
      message: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút.',
      retryAfter: '15 minutes',
      attempts: 5
    });
  }
});

// Progressive delay for repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // allow 2 requests per windowMs without delay
  delayMs: () => 500, // add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // max delay of 20 seconds
});

// Avatar upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 uploads per minute
  message: {
    error: 'Quá nhiều lần upload, vui lòng thử lại sau 1 phút',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    error: 'Quá nhiều yêu cầu reset password, vui lòng thử lại sau 1 giờ',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
});

module.exports = {
  generalLimiter,
  loginLimiter,
  speedLimiter,
  uploadLimiter,
  passwordResetLimiter
};