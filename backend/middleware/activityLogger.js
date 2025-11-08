const ActivityLog = require('../models/ActivityLog');

// Get client IP address
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.headers['x-forwarded-for']?.split(',')[0] ||
         'unknown';
};

// Log user activity
const logActivity = async (userId, action, details = '', req = null, metadata = {}) => {
  try {
    const logEntry = new ActivityLog({
      userId: userId || null,
      action,
      details,
      ipAddress: req ? getClientIP(req) : 'system',
      userAgent: req ? req.get('User-Agent') || '' : '',
      metadata
    });

    await logEntry.save();
    console.log(`📝 Activity logged: ${action} - User: ${userId || 'anonymous'}`);
  } catch (error) {
    console.error('❌ Activity logging error:', error.message);
  }
};

// Middleware to automatically log activities
const activityLogger = (action, getDetails = null) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json;
    
    res.json = function(data) {
      // Log activity after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?._id || null;
        const details = getDetails ? getDetails(req, data) : '';
        
        // Don't await to avoid blocking response
        logActivity(userId, action, details, req, {
          statusCode: res.statusCode,
          method: req.method,
          url: req.originalUrl
        }).catch(console.error);
      }
      
      // Call original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Log failed activities (like failed login)
const logFailedActivity = async (action, details, req, metadata = {}) => {
  await logActivity(null, action, details, req, {
    ...metadata,
    failed: true
  });
};

module.exports = {
  logActivity,
  activityLogger,
  logFailedActivity,
  getClientIP
};