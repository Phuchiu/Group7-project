# Group7-project - User Management System

## Mô tả dự án
Ứng dụng quản lý người dùng full-stack sử dụng Node.js, React và MongoDB. Dự án thực hiện đầy đủ các chức năng CRUD (Create, Read, Update, Delete) cho quản lý thông tin người dùng.

## Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React.js** - UI library
- **Axios** - HTTP client
- **CSS** - Styling

### Database
- **MongoDB Atlas** - Cloud database
- **Collection:** users
- **Schema:** name, email, timestamps

## Cấu trúc dự án
```
Group7-project/
├── backend/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── user.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   └── (React app files)
├── README_Backend.md
└── README.md
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/users` | Lấy danh sách tất cả user |
| POST | `/users` | Tạo user mới |
| PUT | `/users/:id` | Cập nhật user theo ID |
| DELETE | `/users/:id` | Xóa user theo ID |

## Hướng dẫn chạy dự án

### 1. Clone repository
```bash
git clone https://github.com/Phuchiu/Group7-project.git
cd Group7-project
```

### 2. Chạy Backend
```bash
cd backend
npm install
npm run dev
```
Backend sẽ chạy trên: `http://localhost:3000`

### 3. Chạy Frontend
```bash
cd frontend
npm install
npm start
```
Frontend sẽ chạy trên: `http://localhost:3001`

### 4. Cấu hình Database
Tạo file `.env` trong thư mục `backend/`:
```
MONGODB_URI=mongodb+srv://admin:1234567890@cluster0.fmvyp3m.mongodb.net/groupDB
PORT=3000
```

## Đóng góp từng thành viên

### 👨‍💻 Sinh viên 1 - Backend Developer
**Vai trò:** Phát triển server-side và API

**Nhiệm vụ hoàn thành:**
- ✅ Thiết lập Node.js server với Express
- ✅ Tạo REST API CRUD đầy đủ cho User
- ✅ Tích hợp MongoDB với Mongoose
- ✅ Xử lý CORS cho frontend
- ✅ Cấu trúc thư mục backend chuẩn
- ✅ Error handling và validation

**Files chính:**
- `server.js` - Server chính
- `controllers/userController.js` - Logic xử lý
- `routes/user.js` - Định tuyến API
- `models/User.js` - Schema MongoDB

### 👩‍💻 Sinh viên 2 - Frontend Developer
**Vai trò:** Phát triển giao diện người dùng

**Nhiệm vụ:**
- Tạo ứng dụng React
- Thiết kế components UserList, AddUser
- Kết nối API backend với Axios
- Xử lý state và form validation
- Responsive design

### 👨‍💻 Sinh viên 3 - Database Developer
**Vai trò:** Thiết kế và quản lý database

**Nhiệm vụ:**
- Thiết lập MongoDB Atlas
- Tạo database `groupDB` và collection `users`
- Thiết kế User schema
- Tối ưu hóa queries
- Backup và bảo mật database

## Tính năng chính

- ✅ **Xem danh sách người dùng** - Hiển thị tất cả users từ database
- ✅ **Thêm người dùng mới** - Form tạo user với validation
- ✅ **Cập nhật thông tin** - Chỉnh sửa thông tin user
- ✅ **Xóa người dùng** - Xóa user khỏi database
- ✅ **Responsive design** - Tương thích mobile
- ✅ **Real-time updates** - Cập nhật ngay lập tức

## Demo

### API Testing với Postman
```bash
# GET - Lấy danh sách users
GET http://localhost:3000/users

# POST - Tạo user mới
POST http://localhost:3000/users
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com"
}

# PUT - Cập nhật user
PUT http://localhost:3000/users/USER_ID
Content-Type: application/json
{
  "name": "John Updated"
}

# DELETE - Xóa user
DELETE http://localhost:3000/users/USER_ID
```

## Troubleshooting

### Lỗi CORS
- Đảm bảo backend có cài `cors` middleware
- Kiểm tra frontend gọi đúng URL backend

### Lỗi MongoDB Connection
- Kiểm tra connection string trong `.env`
- Đảm bảo IP được whitelist trong MongoDB Atlas

### Port đã được sử dụng
- Thay đổi PORT trong `.env`
- Hoặc kill process đang chạy: `npx kill-port 3000`

## License
MIT License - Dự án học tập

## Liên hệ
- Repository: https://github.com/Phuchiu/Group7-project
- Issues: https://github.com/Phuchiu/Group7-project/issues

---
**Nhóm 7 - Phát triển ứng dụng Web với Node.js + React + MongoDB**