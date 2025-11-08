const express = require('express');
const { 
  getUserActivityLogs, 
  getActivityStats, 
  getMyActivityLogs 
} = require('../controllers/activityController');
const { auth, checkRole } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply general rate limiting
router.use(generalLimiter);

// Admin and Moderator routes
router.get('/logs', auth, checkRole('admin', 'moderator'), getUserActivityLogs);
router.get('/stats', auth, checkRole('admin', 'moderator'), getActivityStats);

// User routes
router.get('/my-logs', auth, getMyActivityLogs);

module.exports = router;