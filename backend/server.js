const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware - CORS cho phép tất cả origins
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const rbacRoutes = require('./routes/rbac');
const avatarRoutes = require('./routes/avatar');
const activityRoutes = require('./routes/activity');

app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/rbac', rbacRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/activity', activityRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'User Management API - Group 7',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login, /api/auth/signup',
      users: '/api/users',
      profile: '/api/profile'
    }
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Server is running!`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://192.168.56.1:${PORT}`);
  console.log(`📚 API:     http://192.168.56.1:${PORT}/api`);
  console.log(`🔑 Login:   http://192.168.56.1:${PORT}/api/auth/login`);
  console.log(`${'='.repeat(60)}\n`);
});