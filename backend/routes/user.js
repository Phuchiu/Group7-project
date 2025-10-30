const express = require('express');
const { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserStats 
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Admin routes (must be before parameterized routes)
router.get('/users/stats', auth, adminAuth, getUserStats);

// Debug route
router.get('/debug/user', auth, (req, res) => {
  res.json({ user: req.user, message: 'Auth working' });
});

// CRUD routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', auth, deleteUser);

module.exports = router;