# Demo Rate Limit - Login Protection

## Cách test Rate Limit:

### 1. Mở Postman
### 2. Tạo request login với thông tin SAI:
```
URL: http://localhost:3001/api/auth/login
Method: POST
Headers: Content-Type: application/json
Body:
{
  "email": "test@example.com",
  "password": "wrong_password"
}
```

### 3. Gửi request này 6 lần liên tiếp
- Lần 1-5: Sẽ trả về lỗi "Email hoặc mật khẩu không đúng"
- Lần 6: Sẽ trả về lỗi Rate Limit với message:
```json
{
  "error": "Quá nhiều lần đăng nhập thất bại",
  "message": "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút.",
  "retryAfter": "15 minutes",
  "attempts": 5
}
```

### 4. Chụp ảnh cần thiết:
1. **Response lần thứ 5** (vẫn cho phép login)
2. **Response lần thứ 6** (bị rate limit)
3. **Console log backend** hiển thị rate limit được kích hoạt
4. **Headers response** hiển thị rate limit info

### 5. Kiểm tra Activity Log:
```
URL: http://localhost:3001/api/activity/logs
Method: GET
Headers: Authorization: Bearer YOUR_ADMIN_TOKEN
```
Sẽ thấy log "RATE_LIMIT_HIT" được ghi lại.

## Rate Limit Configuration hiện tại:
- **Window**: 15 phút
- **Max attempts**: 5 lần
- **Scope**: Per IP address
- **Reset**: Tự động sau 15 phút