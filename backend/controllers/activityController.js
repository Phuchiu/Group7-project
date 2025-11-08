const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

// Get user activity logs (Admin only)
const getUserActivityLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      userId, 
      action, 
      startDate, 
      endDate 
    } = req.query;

    // Build filter
    const filter = {};
    
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Get logs with pagination
    const logs = await ActivityLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const total = await ActivityLog.countDocuments(filter);

    res.json({
      message: 'Lấy activity logs thành công',
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi lấy activity logs', 
      error: error.message 
    });
  }
};

// Get activity statistics (Admin only)
const getActivityStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Activity count by action
    const actionStats = await ActivityLog.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Activity count by day
    const dailyStats = await ActivityLog.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Top active users
    const topUsers = await ActivityLog.aggregate([
      { 
        $match: { 
          timestamp: { $gte: startDate },
          userId: { $ne: null }
        } 
      },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          count: 1,
          'user.name': 1,
          'user.email': 1,
          'user.role': 1
        }
      }
    ]);

    // Failed login attempts
    const failedLogins = await ActivityLog.countDocuments({
      action: 'LOGIN_FAILED',
      timestamp: { $gte: startDate }
    });

    // Rate limit hits
    const rateLimitHits = await ActivityLog.countDocuments({
      action: 'RATE_LIMIT_HIT',
      timestamp: { $gte: startDate }
    });

    res.json({
      message: 'Lấy thống kê activity thành công',
      stats: {
        actionStats,
        dailyStats,
        topUsers,
        failedLogins,
        rateLimitHits,
        period: `${days} days`
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi lấy thống kê activity', 
      error: error.message 
    });
  }
};

// Get current user's activity logs
const getMyActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const logs = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-userAgent -ipAddress') // Hide sensitive info
      .lean();

    const total = await ActivityLog.countDocuments({ userId });

    res.json({
      message: 'Lấy activity logs cá nhân thành công',
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi lấy activity logs cá nhân', 
      error: error.message 
    });
  }
};

module.exports = {
  getUserActivityLogs,
  getActivityStats,
  getMyActivityLogs
};