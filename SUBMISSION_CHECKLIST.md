# 📋 CHECKLIST SẢN PHẨM NỘP - GROUP 7

## ✅ 1. Ảnh Postman Test API Log

### Authentication APIs:
- [ ] **POST /api/auth/signup** - Đăng ký thành công
- [ ] **POST /api/auth/login** - Đăng nhập thành công  
- [ ] **POST /api/auth/login** - Đăng nhập sai password (5 lần)
- [ ] **POST /api/auth/refresh** - Refresh token thành công

### User Management APIs:
- [ ] **GET /api/users** - Lấy danh sách users
- [ ] **POST /api/users** - Tạo user mới
- [ ] **PUT /api/users/:id** - Cập nhật user
- [ ] **DELETE /api/users/:id** - Xóa user

### Avatar Management APIs:
- [ ] **POST /api/avatar/upload** - Upload avatar thành công
- [ ] **GET /api/avatar/info** - Lấy thông tin avatar
- [ ] **DELETE /api/avatar/delete** - Xóa avatar

### Activity Logs:
- [ ] **GET /api/activity/logs** - Xem activity logs

## ✅ 2. Demo Rate Limit

### Screenshots cần chụp:
- [ ] **Lần login thứ 1-4**: Response lỗi "Email hoặc mật khẩu không đúng"
- [ ] **Lần login thứ 5**: Response lỗi "Email hoặc mật khẩu không đúng" 
- [ ] **Lần login thứ 6**: Response rate limit với message:
  ```json
  {
    "error": "Quá nhiều lần đăng nhập thất bại",
    "message": "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút.",
    "retryAfter": "15 minutes",
    "attempts": 5
  }
  ```
- [ ] **Console log backend**: Hiển thị rate limit được kích hoạt
- [ ] **Activity logs**: Hiển thị "RATE_LIMIT_HIT" events

## ✅ 3. Link PR GitHub

### Chuẩn bị PR:
- [ ] **Commit code**: `git add . && git commit -m "feat: Add authentication, rate limiting, and activity logging"`
- [ ] **Push code**: `git push origin main`
- [ ] **Tạo PR** với title: "feat: Implement Authentication System with Rate Limiting and Activity Logging"
- [ ] **Description đầy đủ** theo template trong `GITHUB_PR_GUIDE.md`
- [ ] **Copy link PR** để nộp

### Link PR format:
```
https://github.com/Phuchiu/Group7-project/pull/[NUMBER]
```

## 📁 Files đã tạo để hỗ trợ:

1. **POSTMAN_TEST_GUIDE.md** - Hướng dẫn test API
2. **RATE_LIMIT_DEMO.md** - Hướng dẫn demo rate limit  
3. **AVATAR_UPLOAD_GUIDE.md** - Hướng dẫn test avatar upload
4. **GITHUB_PR_GUIDE.md** - Hướng dẫn tạo PR
5. **Group7_API_Collection.postman_collection.json** - Postman collection
6. **test_api.js** - Script test API tự động
7. **test_avatar_upload.js** - Script test avatar upload

## 🚀 Các bước thực hiện:

### Bước 1: Import Postman Collection
```bash
# Import file này vào Postman:
Group7_API_Collection.postman_collection.json
```

### Bước 2: Test APIs và chụp ảnh
- Chạy từng request trong Postman
- Chụp ảnh response của mỗi API
- Đặc biệt chú ý rate limit demo

### Bước 3: Tạo PR GitHub
- Follow hướng dẫn trong `GITHUB_PR_GUIDE.md`
- Copy link PR

### Bước 4: Nộp sản phẩm
- **Ảnh Postman**: Tất cả screenshots API tests
- **Demo rate limit**: Screenshots rate limiting
- **Link PR**: URL của GitHub Pull Request

## 🎯 Điểm nổi bật của dự án:

- ✅ **Full Authentication System** với JWT
- ✅ **Rate Limiting** bảo vệ khỏi brute force
- ✅ **Activity Logging** theo dõi hoạt động
- ✅ **Avatar Upload** với local storage
- ✅ **RBAC System** phân quyền user/moderator/admin
- ✅ **Complete CRUD** operations
- ✅ **Security Features** đầy đủ
- ✅ **API Documentation** chi tiết

## 📞 Liên hệ hỗ trợ:
Nếu có vấn đề gì, hãy kiểm tra:
1. Server đang chạy trên port 3001
2. MongoDB connection thành công
3. Frontend API URL đã update thành http://localhost:3001