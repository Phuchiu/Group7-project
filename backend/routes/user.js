const express = require('express');
const { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserStats 
} = require('../controllers/userController');
const { auth, adminAuth, checkRole, moderatorAuth } = require('../middleware/auth');

const router = express.Router();

// Admin routes (must be before parameterized routes)
router.get('/users/stats', auth, checkRole('admin'), getUserStats);

// Debug route
router.get('/debug/user', auth, (req, res) => {
  res.json({ user: req.user, message: 'Auth working' });
});

// CRUD routes with RBAC
router.get('/users', auth, checkRole('admin', 'moderator'), getUsers);
router.post('/users', auth, checkRole('admin'), createUser);
router.put('/users/:id', auth, checkRole('admin', 'moderator'), updateUser);
router.delete('/users/:id', auth, deleteUser);

module.exports = router;