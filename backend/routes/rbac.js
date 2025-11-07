const express = require('express');
const { 
  getUserPermissions, 
  updateUserRole, 
  getRoleStats,
  moderatorActions
} = require('../controllers/rbacController');
const { auth, adminAuth, checkRole, moderatorAuth, adminOrOwner } = require('../middleware/auth');

const router = express.Router();

// Get current user permissions
router.get('/permissions', auth, getUserPermissions);

// Role statistics (Admin only)
router.get('/stats', auth, checkRole('admin'), getRoleStats);

// Update user role (Admin only)
router.put('/users/:userId/role', auth, checkRole('admin'), updateUserRole);

// Moderator routes
router.get('/users/:userId/details', auth, checkRole('admin', 'moderator'), moderatorActions.viewUserDetails);
router.put('/users/:userId/profile', auth, checkRole('admin', 'moderator'), moderatorActions.updateUserProfile);

// Test routes for different roles
router.get('/admin-only', auth, checkRole('admin'), (req, res) => {
  res.json({ message: 'Chỉ admin mới thấy được tin nhắn này!', user: req.user.name });
});

router.get('/moderator-admin', auth, checkRole('admin', 'moderator'), (req, res) => {
  res.json({ message: 'Admin và Moderator đều thấy được tin nhắn này!', user: req.user.name });
});

router.get('/all-roles', auth, checkRole('admin', 'moderator', 'user'), (req, res) => {
  res.json({ message: 'Tất cả role đều thấy được tin nhắn này!', user: req.user.name, role: req.user.role });
});

// Resource ownership test
router.get('/users/:id/sensitive', auth, adminOrOwner, (req, res) => {
  res.json({ 
    message: 'Thông tin nhạy cảm - chỉ admin hoặc chủ sở hữu mới xem được!',
    userId: req.params.id,
    accessedBy: req.user.name,
    role: req.user.role
  });
});

module.exports = router;