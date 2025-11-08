# Forgot Password & Reset Password Feature

## 🎯 Mục tiêu
Gửi email thật với token reset password, tăng tính bảo mật cho hệ thống User Management.

## 🚀 Tính năng đã thực hiện

### SV1: Backend API Development
✅ **API /auth/forgot-password**
- Nhận email từ user
- Sinh token reset password (32 bytes hex)
- Lưu token và thời gian hết hạn vào database
- Gửi email chứa link reset password

✅ **API /auth/reset-password/:token**
- Xác thực token và thời gian hết hạn
- Cập nhật mật khẩu mới
- Xóa token sau khi sử dụng

### SV3: Email Configuration
✅ **Nodemailer + Gmail SMTP**
- Cấu hình Gmail SMTP với App Password
- Template email HTML đẹp mắt
- Link reset password tự động

### SV2: Frontend Implementation
✅ **Form nhập email (ForgotPassword.js)**
- Giao diện thân thiện
- Validation email
- Thông báo gửi email thành công

✅ **Form đổi password mới (ResetPassword.js)**
- Nhập mật khẩu mới và xác nhận
- Validation mật khẩu
- Redirect về login sau khi thành công

## 📁 Cấu trúc Files

### Backend
```
backend/
├── controllers/authController.js    # Thêm forgotPassword, resetPassword
├── models/User.js                   # Thêm resetPasswordToken, resetPasswordExpires
├── routes/auth.js                   # Thêm routes forgot/reset password
├── services/emailService.js         # Service gửi email
├── testEmail.js                     # Test email functionality
└── .env                            # Cấu hình email
```

### Frontend
```
frontend/
├── src/components/
│   ├── ForgotPassword.js           # Form quên mật khẩu
│   ├── ResetPassword.js            # Form đặt lại mật khẩu
│   └── Login.js                    # Thêm link "Quên mật khẩu?"
├── src/App.js                      # Thêm routing
└── package.json                    # Thêm react-router-dom
```

## 🔧 Cài đặt và Cấu hình

### 1. Cài đặt Dependencies
```bash
# Backend
cd backend
npm install nodemailer

# Frontend
cd frontend
npm install react-router-dom
```

### 2. Cấu hình Gmail SMTP
1. Bật 2-Factor Authentication cho Gmail
2. Tạo App Password:
   - Google Account > Security > 2-Step Verification
   - App passwords > Mail > Generate
3. Cập nhật `.env`:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
FRONTEND_URL=http://localhost:3001
```

### 3. Test Email
```bash
cd backend
node testEmail.js
```

## 🌐 API Documentation

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Email đặt lại mật khẩu đã được gửi"
}
```

### Reset Password
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Mật khẩu đã được đặt lại thành công"
}
```

## 🎨 Frontend Routes

- `/` - Login page với link "Quên mật khẩu?"
- `/reset-password/:token` - Form đặt lại mật khẩu

## 📧 Email Template

Email được gửi bao gồm:
- Tiêu đề: "Đặt lại mật khẩu - Group 7 User Management"
- Nội dung HTML với link reset password
- Thời gian hết hạn: 1 giờ
- Thiết kế responsive và professional

## 🔒 Bảo mật

- Token reset password: 32 bytes hex (256-bit entropy)
- Thời gian hết hạn: 1 giờ
- Token chỉ sử dụng được 1 lần
- Validation email format
- Password minimum 6 characters

## 🧪 Testing

### Manual Testing
1. Truy cập trang login
2. Click "Quên mật khẩu?"
3. Nhập email và submit
4. Kiểm tra email inbox
5. Click link trong email
6. Nhập mật khẩu mới
7. Verify login với mật khẩu mới

### API Testing với Postman
```bash
# Test forgot password
POST http://localhost:3000/api/auth/forgot-password
{
  "email": "test@example.com"
}

# Test reset password (thay TOKEN bằng token thật)
POST http://localhost:3000/api/auth/reset-password/TOKEN
{
  "password": "newpassword123"
}
```

## 📸 Screenshots Required

1. **Email nhận token** - Ảnh chụp email trong inbox
2. **Frontend forgot password form** - Form nhập email
3. **Frontend reset password form** - Form nhập mật khẩu mới
4. **Success messages** - Thông báo thành công

## 🔗 GitHub

- **Branch:** `feature/forgot-password`
- **Pull Request:** https://github.com/Phuchiu/Group7-project/pull/new/feature/forgot-password
- **Commit message:** "Thêm chức năng quên mật khẩu"

## ✅ Checklist

- [x] API forgot password
- [x] API reset password  
- [x] Email service với Nodemailer
- [x] Gmail SMTP configuration
- [x] Frontend forgot password form
- [x] Frontend reset password form
- [x] React Router integration
- [x] Email template design
- [x] Security implementation
- [x] Error handling
- [x] Documentation
- [x] Git branch và commit
- [x] Push to GitHub

## 🎉 Kết quả

Hệ thống forgot password hoàn chỉnh với:
- ✅ Gửi email thật qua Gmail SMTP
- ✅ Token bảo mật với thời gian hết hạn
- ✅ Giao diện frontend thân thiện
- ✅ API RESTful chuẩn
- ✅ Tích hợp hoàn chỉnh với hệ thống hiện tại