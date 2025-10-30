const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Admin routes - yêu cầu quyền admin
router.get('/users', authenticate, requireAdmin, userController.getUsers);
router.get('/users/stats', authenticate, requireAdmin, userController.getUserStats);

// Delete route - admin hoặc tự xóa
router.delete('/users/:id', authenticate, userController.deleteUser);

module.exports = router;