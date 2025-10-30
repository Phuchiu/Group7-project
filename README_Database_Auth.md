# README_Database_Auth.md - Hoạt động 1

## Vai trò: Sinh viên 3 - Database + Git Manager

### ✅ Hoạt động 1: Authentication cơ bản - HOÀN THÀNH

#### 🗂️ Schema User + Role đã tạo:
```javascript
// models/User.js
{
  name: String (required, trim),
  email: String (required, unique, lowercase),
  password: String (required, minlength: 6, hashed with bcrypt),
  role: String (enum: ['user', 'admin'], default: 'user'),
  avatar: String (default: ''),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isActive: Boolean (default: true),
  timestamps: true
}
```

#### 🔧 Middleware Authentication:
- `auth`: Xác thực JWT token
- `adminAuth`: Kiểm tra quyền admin
- Password hashing với bcrypt (salt rounds: 12)
- JWT token expires: 30 days

#### 🌐 API Endpoints:
- `POST /api/auth/signup` - Đăng ký
- `POST /api/auth/login` - Đăng nhập  
- `POST /api/auth/logout` - Đăng xuất

#### 📋 Test Data:
- Admin: admin@test.com / 123456
- User: user@test.com / 123456
- Chạy: `node testData.js` để tạo test users

#### 🧪 Postman Testing:
1. Import file `postman-collection.json`
2. Test endpoints:
   - Sign Up: POST /api/auth/signup
   - Login: POST /api/auth/login  
   - Logout: POST /api/auth/logout

#### 📁 Files đã tạo:
- `models/User.js` - Schema với authentication
- `controllers/authController.js` - Logic xử lý auth
- `routes/auth.js` - Routes cho auth
- `middleware/auth.js` - JWT middleware
- `testData.js` - Script tạo test users
- `postman-collection.json` - Postman collection
- `.env` - Thêm JWT_SECRET

#### 🚀 Hướng dẫn chạy:
```bash
cd backend
npm run dev
# Server chạy tại http://localhost:3000
```

#### 🔗 Git Branch:
- Branch: `database-auth`
- Đã push lên GitHub
- Sẵn sàng tạo Pull Request

### 📸 Screenshots cần chụp:
1. Postman test /api/auth/signup
2. Postman test /api/auth/login (có JWT token)
3. Postman test /api/auth/logout
4. MongoDB data với users đã tạo