# 🚀 Deployment Guide - Group7 Project

## 📋 Pre-deployment Checklist

### ✅ Code Quality
- [ ] All features tested locally
- [ ] No console.log in production code
- [ ] Environment variables configured
- [ ] Error handling implemented
- [ ] Security measures in place

### ✅ Database
- [ ] MongoDB Atlas configured
- [ ] Database indexes created
- [ ] Backup strategy implemented
- [ ] Connection string secured

### ✅ Security
- [ ] JWT secrets generated
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] File upload restrictions set

## 🌐 Backend Deployment (Railway/Heroku)

### Railway Deployment
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up
```

### Environment Variables (Railway)
```env
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/groupDB
JWT_SECRET=your-super-secret-jwt-key-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-production-email@gmail.com
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=3000
NODE_ENV=production
```

### Heroku Deployment
```bash
# 1. Install Heroku CLI
# Download from https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create group7-backend

# 4. Set environment variables
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set JWT_REFRESH_SECRET="your-refresh-secret"
heroku config:set EMAIL_USER="your-email@gmail.com"
heroku config:set EMAIL_PASS="your-app-password"
heroku config:set FRONTEND_URL="https://your-frontend.vercel.app"

# 5. Deploy
git push heroku main
```

## 🎨 Frontend Deployment (Vercel/Netlify)

### Vercel Deployment
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy from frontend directory
cd frontend
vercel

# 4. Set environment variables in Vercel dashboard
REACT_APP_API_URL=https://your-backend.railway.app
```

### Netlify Deployment
```bash
# 1. Build project
cd frontend
npm run build

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Login
netlify login

# 4. Deploy
netlify deploy --prod --dir=build

# 5. Set environment variables in Netlify dashboard
REACT_APP_API_URL=https://your-backend.railway.app
```

## 🔧 Production Configuration

### Backend Production Setup
```javascript
// server.js - Production optimizations
const express = require('express');
const helmet = require('helmet'); // Security headers
const compression = require('compression'); // Gzip compression

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Trust proxy for Railway/Heroku
app.set('trust proxy', 1);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

### Frontend Production Build
```json
// package.json - Build scripts
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  }
}
```

## 📊 Monitoring & Analytics

### Backend Monitoring
```javascript
// Add to server.js
const morgan = require('morgan');

// Request logging
app.use(morgan('combined'));

// Error tracking
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
```

### Performance Monitoring
```bash
# Add performance monitoring
npm install --save @sentry/node @sentry/tracing

# Configure in server.js
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});
```

## 🔒 Security Hardening

### Production Security Checklist
- [ ] HTTPS enabled
- [ ] Security headers configured (Helmet.js)
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure cookie settings
- [ ] Environment variables secured
- [ ] Database access restricted

### Security Headers
```javascript
// Enhanced security configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 📈 Performance Optimization

### Backend Optimization
```javascript
// Database connection optimization
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Caching middleware
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache frequently accessed data
app.get('/api/users/stats', cache(300), getUserStats);
```

### Frontend Optimization
```javascript
// Code splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/DashboardRedux'));
const AdminPanel = lazy(() => import('./components/AdminRedux'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

## 🧪 Testing in Production

### Health Checks
```bash
# Backend health check
curl https://your-backend.railway.app/health

# Expected response
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### API Testing
```bash
# Test authentication
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected route
curl -X GET https://your-backend.railway.app/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test config
# artillery.yml
config:
  target: 'https://your-backend.railway.app'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/users/stats"

# Run load test
artillery run artillery.yml
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          cd frontend
          npm install -g vercel
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

## 📊 Monitoring Dashboard

### Key Metrics to Monitor
- **Response Time**: < 200ms average
- **Error Rate**: < 1%
- **Uptime**: > 99.9%
- **Database Connections**: Monitor pool usage
- **Memory Usage**: < 80% of allocated
- **CPU Usage**: < 70% average

### Alerting Setup
```javascript
// Simple alerting system
const sendAlert = async (message) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to Slack, Discord, or email
    await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
  }
};

// Monitor critical errors
app.use((err, req, res, next) => {
  if (err.status >= 500) {
    sendAlert(`Critical error: ${err.message}`);
  }
  next(err);
});
```

## 🔧 Troubleshooting Production Issues

### Common Issues & Solutions

#### 1. Database Connection Timeout
```bash
# Check MongoDB Atlas network access
# Ensure 0.0.0.0/0 is whitelisted for cloud deployments
# Or add specific IP ranges
```

#### 2. CORS Errors
```javascript
// Update CORS configuration for production
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

#### 3. File Upload Issues
```javascript
// Ensure uploads directory exists in production
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
```

#### 4. Environment Variables Not Loading
```bash
# Verify all required env vars are set
echo $MONGODB_URI
echo $JWT_SECRET

# Check Railway/Heroku dashboard for missing variables
```

## 📋 Post-Deployment Checklist

### ✅ Functionality Testing
- [ ] User registration works
- [ ] Login/logout functions
- [ ] Password reset via email
- [ ] Avatar upload/delete
- [ ] Admin panel accessible
- [ ] Role-based permissions work
- [ ] Activity logging active

### ✅ Performance Testing
- [ ] Page load times < 3 seconds
- [ ] API responses < 200ms
- [ ] Database queries optimized
- [ ] Images compressed and optimized
- [ ] CDN configured (if applicable)

### ✅ Security Testing
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Authentication secure
- [ ] File upload restrictions enforced

### ✅ Monitoring Setup
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring enabled
- [ ] Log aggregation working
- [ ] Alerting system tested

## 🎯 Success Metrics

### Technical Metrics
- **Uptime**: 99.9%+
- **Response Time**: < 200ms average
- **Error Rate**: < 1%
- **Security Score**: A+
- **Performance Score**: 90+

### Business Metrics
- **User Registration**: Track conversion
- **Daily Active Users**: Monitor engagement
- **Feature Usage**: Analytics on key features
- **User Satisfaction**: Feedback and ratings

---

**🚀 Deployment completed successfully! Your Group7 project is now live in production.**