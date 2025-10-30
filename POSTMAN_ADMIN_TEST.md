# 🔐 Hướng dẫn Test API Admin với Postman

## 📋 Chuẩn bị
1. Khởi động Backend: `cd backend && npm run dev`
2. Tạo Admin User: `node create_admin.js`
3. Server: `http://localhost:3000`

## 🔑 Bước 1: Đăng nhập Admin

### POST - Admin Login
```
URL: http://localhost:3000/api/auth/login
Method: POST
Headers: Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## 👥 Bước 2: Test API Users

### 📋 GET - Danh sách Users (Admin only)
```
URL: http://localhost:3000/api/users
Method: GET
Headers: 
  Authorization: Bearer ADMIN_TOKEN_HERE
```

**Response:**
```json
{
  "message": "Lấy danh sách người dùng thành công",
  "count": 2,
  "users": [
    {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2023-12-01T10:00:00.000Z"
    },
    {
      "_id": "...",
      "name": "Test User",
      "email": "test@example.com", 
      "role": "user",
      "createdAt": "2023-12-01T09:00:00.000Z"
    }
  ]
}
```

### 📊 GET - Thống kê Users (Admin only)
```
URL: http://localhost:3000/api/users/stats
Method: GET
Headers: 
  Authorization: Bearer ADMIN_TOKEN_HERE
```

**Response:**
```json
{
  "totalUsers": 2,
  "adminCount": 1,
  "userCount": 1,
  "message": "Thống kê người dùng"
}
```

### 🗑️ DELETE - Xóa User (Admin hoặc tự xóa)
```
URL: http://localhost:3000/api/users/USER_ID_HERE
Method: DELETE
Headers: 
  Authorization: Bearer ADMIN_TOKEN_HERE
```

**Response:**
```json
{
  "message": "Đã xóa người dùng Test User thành công",
  "deletedUser": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

## 🧪 Test Cases RBAC

### ✅ Test Case 1: Admin truy cập danh sách users
- **Expected:** Status 200, danh sách users

### ❌ Test Case 2: User thường truy cập danh sách users
```
Headers: Authorization: Bearer USER_TOKEN_HERE
```
- **Expected:** Status 403, "Chỉ admin mới có quyền truy cập"

### ✅ Test Case 3: Admin xóa user khác
- **Expected:** Status 200, xóa thành công

### ✅ Test Case 4: User tự xóa tài khoản
```
URL: /api/users/OWN_USER_ID
Headers: Authorization: Bearer USER_TOKEN
```
- **Expected:** Status 200, xóa thành công

### ❌ Test Case 5: User xóa user khác
```
URL: /api/users/OTHER_USER_ID  
Headers: Authorization: Bearer USER_TOKEN
```
- **Expected:** Status 403, "Bạn chỉ có thể xóa tài khoản của chính mình"

### ❌ Test Case 6: Xóa admin cuối cùng
- **Expected:** Status 400, "Không thể xóa admin cuối cùng"

## 📸 Screenshots cần chụp

1. **Admin Login** - Status 200, role: admin
2. **GET Users (Admin)** - Status 200, danh sách users
3. **GET Users (User)** - Status 403, access denied
4. **DELETE User (Admin)** - Status 200, xóa thành công
5. **User Stats** - Status 200, thống kê

**🎯 Mục tiêu:** Chứng minh RBAC hoạt động đúng, admin có full quyền, user bị giới hạn.