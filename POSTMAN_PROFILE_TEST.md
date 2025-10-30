# 🧪 Hướng dẫn Test API Profile với Postman

## 📋 Chuẩn bị
1. Khởi động Backend: `cd backend && npm run dev`
2. Server chạy tại: `http://localhost:3000`
3. Mở Postman

## 🔐 Bước 1: Đăng nhập để lấy Token

### POST - Login
```
URL: http://localhost:3000/api/auth/login
Method: POST
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Response mẫu:**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

**⚠️ Lưu ý:** Copy `token` từ response để sử dụng cho các API tiếp theo.

---

## 👤 Bước 2: Test API Profile

### 📖 GET - Xem thông tin cá nhân

```
URL: http://localhost:3000/api/profile
Method: GET
Headers: 
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
```

**Response mẫu:**
```json
{
  "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "avatar": "",
  "createdAt": "2023-12-01T10:30:00.000Z",
  "updatedAt": "2023-12-01T10:30:00.000Z"
}
```

### ✏️ PUT - Cập nhật thông tin cá nhân

```
URL: http://localhost:3000/api/profile
Method: PUT
Headers: 
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json

Body (raw JSON):
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "avatar": "https://via.placeholder.com/150"
}
```

**Response mẫu:**
```json
{
  "message": "Cập nhật thông tin thành công",
  "user": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "user",
    "avatar": "https://via.placeholder.com/150",
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-01T11:45:00.000Z"
  }
}
```

---

## 🧪 Test Cases chi tiết

### ✅ Test Case 1: GET Profile thành công
- **Mô tả:** Lấy thông tin profile của user đã đăng nhập
- **Expected:** Status 200, trả về thông tin user (không có password)

### ✅ Test Case 2: GET Profile không có token
```
URL: http://localhost:3000/api/profile
Method: GET
Headers: (không có Authorization)
```
- **Expected:** Status 401, message "Token không được cung cấp"

### ✅ Test Case 3: GET Profile với token không hợp lệ
```
Headers: 
  Authorization: Bearer invalid_token_here
```
- **Expected:** Status 401, message "Token không hợp lệ"

### ✅ Test Case 4: PUT Profile thành công
- **Mô tả:** Cập nhật tên và email
- **Expected:** Status 200, thông tin được cập nhật

### ✅ Test Case 5: PUT Profile với email trùng lặp
```json
{
  "name": "Test User",
  "email": "existing@example.com"
}
```
- **Expected:** Status 400, message "Email đã được sử dụng"

### ✅ Test Case 6: PUT Profile thiếu thông tin bắt buộc
```json
{
  "name": ""
}
```
- **Expected:** Status 400, message "Tên và email là bắt buộc"

### ✅ Test Case 7: PUT Profile với avatar URL
```json
{
  "name": "User With Avatar",
  "email": "user@example.com",
  "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
}
```
- **Expected:** Status 200, avatar được cập nhật

---

## 📊 Kết quả mong đợi

### ✅ API GET /profile
- ✅ Trả về thông tin user đầy đủ (trừ password)
- ✅ Yêu cầu authentication
- ✅ Xử lý lỗi khi không có token
- ✅ Xử lý lỗi khi token không hợp lệ

### ✅ API PUT /profile  
- ✅ Cập nhật thông tin thành công
- ✅ Validation tên và email bắt buộc
- ✅ Kiểm tra email trùng lặp
- ✅ Hỗ trợ cập nhật avatar (optional)
- ✅ Trả về thông tin user đã cập nhật

---

## 🔧 Troubleshooting

### Lỗi "Cannot GET /api/profile"
- ✅ Kiểm tra server đã khởi động: `npm run dev`
- ✅ Kiểm tra URL đúng: `http://localhost:3000/api/profile`

### Lỗi 401 Unauthorized
- ✅ Kiểm tra có header Authorization
- ✅ Kiểm tra format: `Bearer YOUR_TOKEN`
- ✅ Kiểm tra token còn hạn (JWT expires)

### Lỗi 400 Bad Request
- ✅ Kiểm tra JSON body hợp lệ
- ✅ Kiểm tra Content-Type: application/json
- ✅ Kiểm tra các field bắt buộc

---

## 📸 Screenshots cần chụp

1. **GET Profile thành công** - Status 200
2. **PUT Profile thành công** - Status 200  
3. **GET Profile sau khi update** - Thông tin đã thay đổi
4. **Error cases** - 401, 400 responses

---

**🎯 Mục tiêu:** Chứng minh API Profile hoạt động đúng với đầy đủ các tính năng CRUD và authentication.