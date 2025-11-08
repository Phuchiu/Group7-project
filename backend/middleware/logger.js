const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, description, req) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      description,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });
  } catch (error) {
    console.error('Log error:', error);
  }
};

module.exports = { logActivity };
