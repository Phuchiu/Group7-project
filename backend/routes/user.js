const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// Profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Admin routes
router.get('/users', adminAuth, userController.getUsers);
router.delete('/users/:id', auth, userController.deleteUser);

module.exports = router;