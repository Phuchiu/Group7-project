# Hướng dẫn Test Avatar Upload với Postman

## ✅ Avatar Upload đã được sửa và hoạt động!

### 1. Test Upload Avatar

#### Request Setup:
```
URL: http://localhost:3001/api/avatar/upload
Method: POST
Headers: 
- Authorization: Bearer YOUR_ACCESS_TOKEN
Body: form-data
- Key: avatar
- Type: File
- Value: Chọn file ảnh (jpg, png, gif, webp)
```

#### Expected Response:
```json
{
  "message": "Upload avatar thành công",
  "avatar": "/uploads/avatar_USER_ID_TIMESTAMP.jpg",
  "user": {
    "_id": "USER_ID",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "avatar": "/uploads/avatar_USER_ID_TIMESTAMP.jpg"
  }
}
```

### 2. Test Get Avatar Info

#### Request Setup:
```
URL: http://localhost:3001/api/avatar/info
Method: GET
Headers: 
- Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Expected Response:
```json
{
  "message": "Lấy thông tin avatar thành công",
  "avatar": "/uploads/avatar_USER_ID_TIMESTAMP.jpg",
  "hasAvatar": true
}
```

### 3. Test Delete Avatar

#### Request Setup:
```
URL: http://localhost:3001/api/avatar/delete
Method: DELETE
Headers: 
- Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Expected Response:
```json
{
  "message": "Xóa avatar thành công",
  "user": {
    "_id": "USER_ID",
    "name": "User Name", 
    "email": "user@example.com",
    "role": "user",
    "avatar": ""
  }
}
```

### 4. View Uploaded Avatar

Sau khi upload thành công, bạn có thể xem avatar tại:
```
http://localhost:3001/uploads/avatar_USER_ID_TIMESTAMP.jpg
```

### 5. Chụp ảnh cần thiết:

1. **Postman upload request** với file được chọn
2. **Response thành công** của upload
3. **Avatar URL** trong response
4. **Truy cập avatar URL** trên browser để xem ảnh
5. **Get avatar info response**
6. **Delete avatar response**

### 6. File Types Supported:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### 7. File Size Limit:
- Maximum: 5MB per file

### 8. Storage:
- Files được lưu trong thư mục `backend/uploads/`
- URL format: `/uploads/avatar_[USER_ID]_[TIMESTAMP].[extension]`

## Troubleshooting:

### Lỗi "Không có file được upload":
- Đảm bảo key trong form-data là "avatar"
- Đảm bảo đã chọn file

### Lỗi "Chỉ cho phép upload file ảnh":
- Kiểm tra file extension
- Chỉ chấp nhận: jpg, jpeg, png, gif, webp

### Lỗi 401 Unauthorized:
- Đảm bảo có Authorization header
- Token phải còn hạn (5 phút)