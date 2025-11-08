const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Security middleware
const { securityHeaders, sanitizeInput, validateRequest } = require('./middleware/security');

// Apply security headers
app.use(securityHeaders);

// Session configuration for CSRF protection
if (!process.env.SESSION_SECRET) {
  console.warn('SESSION_SECRET not configured, generating random secret');
}

app.use(session({
  secret: process.env.SESSION_SECRET || require('crypto').randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Apply security middleware
app.use(validateRequest);
app.use(sanitizeInput);

// Middleware with security limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration with restricted origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Static files with security headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Security headers for static files
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Cache-Control', 'public, max-age=31536000');
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

// Test static files (development only)
if (process.env.NODE_ENV !== 'production') {
  app.get('/test-uploads', (req, res) => {
    const fs = require('fs');
    const uploadsPath = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsPath)) {
      return res.json({ error: 'Uploads directory does not exist' });
    }
    
    const files = fs.readdirSync(uploadsPath);
    res.json({ 
      uploadsPath: uploadsPath.replace(__dirname, ''),
      fileCount: files.length,
      message: 'Static files working'
    });
  });
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;

// Create server with security configurations
const server = http.createServer({
  maxHeaderSize: 16384, // 16KB (reduced from 32KB)
  headersTimeout: 60000, // 60 seconds
  requestTimeout: 300000 // 5 minutes
}, app);

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});