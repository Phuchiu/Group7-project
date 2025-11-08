const helmet = require('helmet');

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Basic input sanitization
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

// Request validation middleware
const validateRequest = (req, res, next) => {
  // Basic request validation
  const contentLength = req.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    return res.status(413).json({ message: 'Request too large' });
  }
  next();
};

module.exports = {
  securityHeaders,
  sanitizeInput,
  validateRequest
};