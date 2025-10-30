# README_Database.md

## Vai trò: Sinh viên 3 - Database (MongoDB)

### Nhiệm vụ đã hoàn thành:

1. **Tích hợp MongoDB Atlas**
   - Tạo model User.js với schema (name, email)
   - Cấu hình kết nối MongoDB qua mongoose
   - Thiết lập file .env cho connection string

2. **Cấu trúc Database**
   - Database: groupDB
   - Collection: users
   - Schema: name (String, required), email (String, required, unique)

3. **CRUD Operations**
   - GET /users - Lấy tất cả users
   - POST /users - Tạo user mới
   - PUT /users/:id - Cập nhật user
   - DELETE /users/:id - Xóa user

### Hướng dẫn sử dụng:

1. Cập nhật MONGODB_URI trong file .env với connection string thực tế từ MongoDB Atlas
2. Chạy server: `npm run dev`
3. Test API qua Postman tại http://localhost:3000

### Files đã tạo:
- models/User.js
- controllers/userController.js
- routes/user.js
- server.js
- .env
- package.json (đã cập nhật)