# Hướng dẫn tạo Pull Request GitHub

## Bước 1: Chuẩn bị code
```bash
# Đảm bảo code đã được commit
git add .
git commit -m "feat: Add authentication, rate limiting, and activity logging"
```

## Bước 2: Push code lên GitHub
```bash
# Push lên branch main hoặc tạo branch mới
git push origin main

# Hoặc tạo branch feature mới
git checkout -b feature/authentication-system
git push origin feature/authentication-system
```

## Bước 3: Tạo Pull Request
1. Vào repository GitHub: https://github.com/Phuchiu/Group7-project
2. Click nút **"Compare & pull request"** 
3. Điền thông tin PR:

### Title:
```
feat: Implement Authentication System with Rate Limiting and Activity Logging
```

### Description:
```markdown
## 🚀 Features Added

### Authentication System
- ✅ User signup/login with JWT tokens
- ✅ Access token (5 minutes) + Refresh token (7 days)
- ✅ Password hashing with bcryptjs
- ✅ Token refresh mechanism

### Rate Limiting & Security
- ✅ Login rate limiting (5 attempts per 15 minutes)
- ✅ General API rate limiting (100 requests per 15 minutes)
- ✅ Progressive delay for repeated requests
- ✅ Upload rate limiting (3 uploads per minute)

### Activity Logging
- ✅ User activity tracking (login, signup, logout)
- ✅ Failed login attempt logging
- ✅ Rate limit hit logging
- ✅ Admin activity log viewing

### User Management
- ✅ CRUD operations for users
- ✅ Role-based access control (user, moderator, admin)
- ✅ Permission system
- ✅ Profile management with avatar upload

### API Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/activity/logs` - Get activity logs

## 🧪 Testing
- ✅ Postman collection included
- ✅ Rate limiting demo ready
- ✅ Activity logging verified
- ✅ All CRUD operations tested

## 📁 Files Changed
- Backend authentication system
- Rate limiting middleware
- Activity logging system
- User management APIs
- Frontend login/signup forms
- API integration

## 🔧 Configuration
- MongoDB connection
- JWT secret keys
- Email service setup
- Cloudinary integration
- Environment variables

## 📸 Demo Screenshots
- Postman API tests
- Rate limiting in action
- Activity logs
- User management interface
```

## Bước 4: Assign reviewers và labels
- Assign: Các thành viên nhóm
- Labels: `enhancement`, `authentication`, `security`
- Milestone: Nếu có

## Bước 5: Link PR để nộp
Copy link PR (ví dụ: https://github.com/Phuchiu/Group7-project/pull/1)