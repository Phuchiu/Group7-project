# README - Sinh viên 2 (Frontend Developer)

## Vai trò
Phát triển giao diện người dùng (Frontend) sử dụng React

## Công việc đã hoàn thành

### Hoạt động 4: Khởi tạo frontend + kết nối API GET/POST
- ✅ Tạo cấu trúc React app trong thư mục `frontend/`
- ✅ Cài đặt axios để kết nối API
- ✅ Tạo component `UserList.jsx` - hiển thị danh sách user
- ✅ Tạo component `AddUser.jsx` - form thêm user
- ✅ Kết nối API GET/POST với backend

### Hoạt động 6: Kết nối frontend với MongoDB
- ✅ Frontend gọi API backend để hiển thị dữ liệu từ MongoDB
- ✅ Test thêm user từ giao diện React
- ✅ Dữ liệu hiển thị real-time từ database

### Hoạt động 7: CRUD nâng cao (PUT/DELETE)
- ✅ Thêm nút "Sửa" và "Xóa" trong UserList
- ✅ Xử lý sự kiện DELETE user
- ✅ Xử lý sự kiện UPDATE user
- ✅ Form có thể chuyển đổi giữa chế độ Thêm/Sửa

### Hoạt động 8: Quản lý state nâng cao & validation
- ✅ Sử dụng useState và useEffect
- ✅ Validation form: kiểm tra name không trống
- ✅ Validation email hợp lệ (regex)
- ✅ Hiển thị thông báo lỗi khi validation fail

## Công nghệ sử dụng
- React 18.2.0
- Axios 1.6.0
- React Hooks (useState, useEffect)

## Hướng dẫn chạy
```bash
cd frontend
npm install
npm start
```

## Cấu trúc thư mục
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── UserList.jsx
│   │   └── AddUser.jsx
│   ├── App.js
│   └── index.js
└── package.json
```

## Tính năng
1. Hiển thị danh sách user từ API
2. Thêm user mới với validation
3. Sửa thông tin user
4. Xóa user
5. Form validation (name, email)
