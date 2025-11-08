const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
require('dotenv').config();

const app = express();

// Middleware - TĂNG GIỚI HẠN
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Static files with better error handling
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

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

// Root route
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

// Test static files
app.get('/test-uploads', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'uploads');
  
  if (!fs.existsSync(uploadsPath)) {
    return res.json({ error: 'Uploads directory does not exist' });
  }
  
  const files = fs.readdirSync(uploadsPath);
  res.json({ 
    uploadsPath,
    files,
    message: 'Static files working'
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;

// TẠO SERVER VỚI GIỚI HẠN HEADER LỚN HƠN
const server = http.createServer({
  maxHeaderSize: 32768 // 32KB (mặc định là 8KB)
}, app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});