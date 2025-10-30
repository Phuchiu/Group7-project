const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

// Admin only routes
router.get('/stats', adminAuth, adminController.getUserStats);
router.put('/users/:id/role', adminAuth, adminController.updateUserRole);
router.put('/users/:id/status', adminAuth, adminController.toggleUserStatus);

module.exports = router;