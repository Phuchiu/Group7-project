const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout', 
      'signup',
      'profile_update',
      'password_change',
      'password_reset_request',
      'password_reset_complete',
      'avatar_upload',
      'avatar_delete',
      'admin_user_create',
      'admin_user_update',
      'admin_user_delete',
      'admin_role_change',
      'failed_login',
      'account_locked',
      'account_unlocked'
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for performance
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ ipAddress: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });

// TTL index - auto delete logs older than 90 days
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Static methods
activityLogSchema.statics.logActivity = async function(userId, action, details = {}, req = null) {
  try {
    const logData = {
      userId,
      action,
      details,
      ipAddress: req ? (req.ip || req.connection.remoteAddress || 'unknown') : 'system',
      userAgent: req ? req.get('User-Agent') || '' : 'system',
      timestamp: new Date()
    };

    const log = new this(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Activity logging error:', error.message);
    return null;
  }
};

// Get user activity logs
activityLogSchema.statics.getUserLogs = async function(userId, limit = 50, skip = 0) {
  return await this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .populate('userId', 'name email role');
};

// Get logs by action
activityLogSchema.statics.getLogsByAction = async function(action, limit = 100, skip = 0) {
  return await this.find({ action })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .populate('userId', 'name email role');
};

// Get failed login attempts
activityLogSchema.statics.getFailedLogins = async function(ipAddress, timeWindow = 15) {
  const since = new Date(Date.now() - timeWindow * 60 * 1000);
  return await this.countDocuments({
    action: 'failed_login',
    ipAddress,
    timestamp: { $gte: since }
  });
};

// Get activity statistics
activityLogSchema.statics.getActivityStats = async function(timeRange = 24) {
  const since = new Date(Date.now() - timeRange * 60 * 60 * 1000);
  
  const stats = await this.aggregate([
    { $match: { timestamp: { $gte: since } } },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        successCount: {
          $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
        },
        failureCount: {
          $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return stats;
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);