# README_Database_Complete.md - Sinh viên 3

## 🎯 Vai trò: Database + Git Manager - HOÀN THÀNH TẤT CẢ

### ✅ Hoạt động 1: Authentication cơ bản
- **Schema User + Role**: Bcrypt hashing, JWT, role-based access
- **API**: /api/auth/signup, /api/auth/login, /api/auth/logout
- **Middleware**: auth, adminAuth
- **Test Data**: admin@test.com, user@test.com (password: 123456)

### ✅ Hoạt động 2: Profile Management  
- **API**: GET/PUT /api/profile (authenticated users)
- **Features**: Update name, email, password, avatar
- **Security**: JWT required, user can only update own profile

### ✅ Hoạt động 3: Admin Management
- **API**: GET /api/admin/stats, PUT /api/admin/users/:id/role, PUT /api/admin/users/:id/status
- **Features**: User statistics, role management, activate/deactivate users
- **RBAC**: Admin-only access

## 🗂️ Cấu trúc Database Schema:
```javascript
User {
  name: String (required, trim),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  avatar: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isActive: Boolean (default: true),
  timestamps: true
}
```

## 🌐 API Endpoints Summary:
### Authentication
- POST /api/auth/signup
- POST /api/auth/login  
- POST /api/auth/logout

### Profile (Auth Required)
- GET /api/profile
- PUT /api/profile

### User Management
- GET /api/users (Admin only)
- DELETE /api/users/:id (Admin or self)

### Admin Only
- GET /api/admin/stats
- PUT /api/admin/users/:id/role
- PUT /api/admin/users/:id/status

## 🧪 Testing:
1. **Setup**: `npm run dev`
2. **Test Data**: `node testData.js`
3. **Profile Test**: `node testProfile.js`
4. **Postman**: Import `postman-collection.json`

## 📁 Files Created:
- models/User.js (Enhanced schema)
- controllers/authController.js
- controllers/userController.js (Profile management)
- controllers/adminController.js
- routes/auth.js
- routes/user.js (Updated with auth)
- routes/admin.js
- middleware/auth.js
- testData.js, testProfile.js
- postman-collection.json (Complete API collection)

## 🔗 Git Management:
- **Branch**: database-auth
- **Status**: Ready for Pull Request
- **Commits**: 3 major commits for each activity

## 📸 Screenshots Ready:
1. Postman tests for all endpoints
2. MongoDB data with test users
3. JWT token authentication working
4. Admin role-based access control
5. Profile update functionality

### 🚀 Next Steps:
- Merge database-auth → main
- Ready for Hoạt động 4 (Advanced features)
- Coordinate with frontend team for API integration