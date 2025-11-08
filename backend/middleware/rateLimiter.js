const rateLimit = require('express-rate-limit');

// Rate limiter cho login - chỉ cho phép 3 lần trong 1 phút
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 3, // Giới hạn 3 requests
  message: {
    message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log('🚫 Rate limit exceeded for IP:', req.ip);
    res.status(429).json({
      message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút.',
      retryAfter: 60
    });
  }
});

// Rate limiter cho API chung - 100 requests/15 phút
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Quá nhiều requests. Vui lòng thử lại sau.'
  }
});

module.exports = { loginLimiter, apiLimiter };
