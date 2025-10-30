# Group7-project

## 📝 Mô tả dự án
Ứng dụng quản lý người dùng (User Management System) với đầy đủ chức năng CRUD (Create, Read, Update, Delete) sử dụng stack công nghệ hiện đại: Node.js, React, và MongoDB.

## 🛠️ Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv
- nodemon

### Frontend
- React 18.2.0
- Axios
- React Hooks (useState, useEffect)

### Tools
- Git & GitHub
- VS Code
- Postman/Insomnia (API testing)

## 📂 Cấu trúc dự án
```
Group7-project/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── user.js
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserList.jsx
│   │   │   └── AddUser.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Hướng dẫn chạy dự án

### 1. Clone repository
```bash
git clone <URL>
cd Group7-project
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
```

Tạo file `.env`:
```
PORT=3000
MONGO_URI=<your_mongodb_connection_string>
```

Chạy backend:
```bash
npm start
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
npm start
```

Ứng dụng sẽ chạy tại:
- Backend: http://localhost:3000
- Frontend: http://localhost:3001

## ✨ Tính năng

- ✅ **GET** - Hiển thị danh sách người dùng
- ✅ **POST** - Thêm người dùng mới
- ✅ **PUT** - Cập nhật thông tin người dùng
- ✅ **DELETE** - Xóa người dùng
- ✅ Form validation (name, email)
- ✅ Real-time data từ MongoDB
- ✅ Responsive UI

## 👥 Đóng góp của từng thành viên

### Sinh viên 1 - Backend Developer
- Thiết lập cấu trúc backend (Node.js + Express)
- Tạo REST API (GET, POST, PUT, DELETE)
- Kết nối MongoDB với Mongoose
- Tạo model User
- Test API với Postman

### Sinh viên 2 - Frontend Developer
- Khởi tạo React app
- Tạo components: UserList, AddUser
- Kết nối API với Axios
- Xử lý CRUD operations trên UI
- Implement form validation
- Quản lý state với React Hooks

### Sinh viên 3 - Database Developer
- Tạo MongoDB Atlas cluster
- Thiết kế database schema
- Tạo collection users
- Cấu hình kết nối database
- Quản lý dữ liệu trên MongoDB

## 📌 API Endpoints

```
GET    /users      - Lấy danh sách tất cả users
POST   /users      - Tạo user mới
PUT    /users/:id  - Cập nhật user theo ID
DELETE /users/:id  - Xóa user theo ID
```

## 🔧 Git Workflow

- Branch `main` - Production code
- Branch `backend` - Backend development
- Branch `frontend` - Frontend development
- Branch `database` - Database configuration

Mỗi thành viên làm việc trên branch riêng và tạo Pull Request để merge vào main.

## 📸 Screenshots

(Thêm ảnh chụp màn hình ứng dụng tại đây)

## 📄 License

MIT License - Group 7 Project