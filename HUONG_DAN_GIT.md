# Hướng dẫn Git cho Sinh viên 2 (Frontend)

## Bước 1: Tạo và chuyển sang branch frontend
```bash
git checkout -b frontend
```

## Bước 2: Add tất cả file đã tạo
```bash
git add .
```

## Bước 3: Commit với message rõ ràng

### Hoạt động 4: Khởi tạo frontend + kết nối API GET/POST
```bash
git commit -m "Hoạt động 4: Khởi tạo React app và kết nối API GET/POST"
git push origin frontend
```
Sau đó tạo Pull Request trên GitHub với title: "Hoạt động 4: Frontend GET/POST"

### Hoạt động 6: Kết nối frontend với MongoDB
```bash
git add .
git commit -m "Hoạt động 6: Kết nối frontend với MongoDB"
git push origin frontend
```
Tạo Pull Request: "Hoạt động 6: Frontend kết nối MongoDB"

### Hoạt động 7: CRUD nâng cao (PUT/DELETE)
```bash
git add .
git commit -m "Hoạt động 7: Thêm chức năng Sửa/Xóa user trên React"
git push origin frontend
```
Tạo Pull Request: "Hoạt động 7: Frontend CRUD đầy đủ"

### Hoạt động 8: Quản lý state nâng cao & validation
```bash
git add .
git commit -m "Hoạt động 8: Thêm validation form và quản lý state nâng cao"
git push origin frontend
```
Tạo Pull Request: "Hoạt động 8: Validation và State Management"

## Bước 4: Merge vào main (Hoạt động 10)
```bash
git checkout main
git merge frontend
git push origin main
```

## Hoặc làm tất cả một lần:
```bash
# Tạo branch
git checkout -b frontend

# Add và commit tất cả
git add .
git commit -m "Frontend hoàn chỉnh: CRUD đầy đủ với validation và state management"

# Push lên GitHub
git push origin frontend

# Tạo Pull Request trên GitHub
# Sau khi được approve, merge vào main
```

## Lưu ý:
- Mỗi lần commit nên có message rõ ràng
- Tạo Pull Request trên GitHub để review code
- Chụp ảnh màn hình giao diện để nộp
- Chụp ảnh màn hình Pull Request để nộp
