# Hướng dẫn Test API với Postman

## 1. Import Collection vào Postman

### Tạo Collection mới:
- Mở Postman
- Click "New" → "Collection" 
- Đặt tên: "Group7 User Management API"

### Thêm các request sau:

## 2. Test Authentication APIs

### 2.1 POST - Đăng ký user mới
```
URL: http://localhost:3001/api/auth/signup
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
{
  "name": "Test User",
  "email": "test@example.com", 
  "password": "123456"
}
```

### 2.2 POST - Đăng nhập
```
URL: http://localhost:3001/api/auth/login
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "123456"
}
```

### 2.3 POST - Refresh Token
```
URL: http://localhost:3001/api/auth/refresh
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

## 3. Test User Management APIs

### 3.1 GET - Lấy danh sách users
```
URL: http://localhost:3001/api/users
Method: GET
Headers: 
- Content-Type: application/json
- Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 3.2 POST - Tạo user mới
```
URL: http://localhost:3001/api/users
Method: POST
Headers: 
- Content-Type: application/json
- Authorization: Bearer YOUR_ACCESS_TOKEN
Body (raw JSON):
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "123456"
}
```

### 3.3 PUT - Cập nhật user
```
URL: http://localhost:3001/api/users/USER_ID
Method: PUT
Headers: 
- Content-Type: application/json
- Authorization: Bearer YOUR_ACCESS_TOKEN
Body (raw JSON):
{
  "name": "Updated Name"
}
```

### 3.4 DELETE - Xóa user
```
URL: http://localhost:3001/api/users/USER_ID
Method: DELETE
Headers: 
- Content-Type: application/json
- Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 4. Chụp ảnh cần thiết:

1. **Response thành công của signup**
2. **Response thành công của login** 
3. **Response lỗi khi login sai password**
4. **Response rate limit khi login quá nhiều lần**
5. **Response của GET users**
6. **Response của POST create user**
7. **Response của PUT update user**
8. **Response của DELETE user**
9. **Console log của backend** (terminal đang chạy server)