const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        message: 'Không có token, truy cập bị từ chối',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Token không hợp lệ',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token đã hết hạn',
        code: 'TOKEN_EXPIRED'
      });
    }
    res.status(401).json({ 
      message: 'Token không hợp lệ',
      code: 'INVALID_TOKEN'
    });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập' });
  }
  next();
};

// Advanced RBAC - Check specific role
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Chỉ ${roles.join(', ')} mới có quyền truy cập`,
        requiredRoles: roles,
        userRole: req.user.role
      });
    }
    next();
  };
};

// Check if user has admin or moderator role
const moderatorAuth = (req, res, next) => {
  if (!['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Chỉ admin hoặc moderator mới có quyền truy cập' });
  }
  next();
};

// Check if user is admin or owns the resource
const adminOrOwner = (req, res, next) => {
  const userId = req.params.id || req.params.userId;
  if (req.user.role === 'admin' || req.user._id.toString() === userId) {
    next();
  } else {
    return res.status(403).json({ message: 'Chỉ admin hoặc chủ sở hữu mới có quyền truy cập' });
  }
};

module.exports = { auth, adminAuth, checkRole, moderatorAuth, adminOrOwner };