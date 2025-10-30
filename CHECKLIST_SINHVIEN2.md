# ✅ Checklist Hoàn thành - Sinh viên 2 (Frontend)

## Hoạt động 4: Khởi tạo frontend + kết nối API GET/POST
- [x] Tạo thư mục frontend
- [x] Khởi tạo React app (npx create-react-app frontend)
- [x] Cài axios: `npm install axios`
- [x] Tạo component UserList.jsx
- [x] Tạo component AddUser.jsx
- [x] Kết nối API GET: axios.get("http://localhost:3000/users")
- [x] Kết nối API POST: axios.post("http://localhost:3000/users", newUser)
- [ ] Commit + push branch frontend
- [ ] Tạo Pull Request
- [ ] Chụp ảnh giao diện hiển thị danh sách user + form thêm user
- [ ] Chụp ảnh Pull Request

## Hoạt động 6: Kết nối frontend với MongoDB
- [x] Frontend gọi API backend để hiển thị dữ liệu từ MongoDB
- [x] Test thêm user từ giao diện React
- [ ] Commit + push branch frontend
- [ ] Tạo Pull Request merge vào main
- [ ] Chụp ảnh giao diện hiển thị dữ liệu từ MongoDB
- [ ] Chụp ảnh Pull Request merge

## Hoạt động 7: CRUD nâng cao (PUT/DELETE)
- [x] Thêm nút "Sửa" trong UserList.jsx
- [x] Thêm nút "Xóa" trong UserList.jsx
- [x] Xử lý sự kiện DELETE: handleDelete với axios.delete
- [x] Xử lý sự kiện UPDATE: handleEdit với axios.put
- [x] Form có thể chuyển đổi giữa chế độ Thêm/Sửa
- [ ] Commit + push branch frontend
- [ ] Tạo Pull Request
- [ ] Chụp ảnh Postman test API PUT/DELETE (backend)
- [ ] Chụp ảnh giao diện React có nút Sửa/Xóa
- [ ] Chụp ảnh Pull Request

## Hoạt động 8: Quản lý state nâng cao & validation
- [x] Sử dụng useState để quản lý state
- [x] Sử dụng useEffect để fetch data
- [x] Validation: kiểm tra name không trống
- [x] Validation: kiểm tra email hợp lệ (regex)
- [x] Hiển thị alert khi validation fail
- [ ] Commit + push branch frontend
- [ ] Tạo Pull Request
- [ ] Chụp ảnh giao diện có validation
- [ ] Chụp ảnh Pull Request

## Hoạt động 10: Hoàn thiện dự án & tổng hợp
- [x] Cập nhật README.md
- [ ] Merge tất cả branch vào main
- [ ] Kiểm tra CRUD đầy đủ (GET, POST, PUT, DELETE)
- [ ] Push bản cuối cùng lên GitHub
- [ ] Chụp ảnh README.md hoàn chỉnh
- [ ] Lấy link repo GitHub đầy đủ code

## Sản phẩm cần nộp:
1. ✅ File code: UserList.jsx, AddUser.jsx, App.js
2. ✅ File README_SinhVien2.md
3. ⏳ Ảnh giao diện hiển thị danh sách user
4. ⏳ Ảnh giao diện form thêm user
5. ⏳ Ảnh giao diện có nút Sửa/Xóa
6. ⏳ Ảnh giao diện validation
7. ⏳ Ảnh Pull Request (nhiều lần)
8. ⏳ Link repo GitHub

## Lệnh Git cần chạy:
```bash
# 1. Tạo branch frontend
git checkout -b frontend

# 2. Add và commit
git add .
git commit -m "Frontend hoàn chỉnh: CRUD đầy đủ với validation"

# 3. Push lên GitHub
git push origin frontend

# 4. Tạo Pull Request trên GitHub

# 5. Merge vào main
git checkout main
git merge frontend
git push origin main
```
