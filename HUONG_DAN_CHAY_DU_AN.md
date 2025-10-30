# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN - QUAN TRỌNG!

## ⚠️ LƯU Ý: Phải chạy Backend TRƯỚC, Frontend SAU!

## Bước 1: Chạy Backend (Terminal 1)

```bash
# Mở terminal thứ nhất
cd backend

# Cài đặt dependencies (chỉ chạy lần đầu)
npm install

# Chạy backend
npm start
```

**Kết quả mong đợi:**
```
Server running on port 3000
Connected to MongoDB
```

Nếu thấy 2 dòng này là backend đã chạy thành công! ✅

## Bước 2: Chạy Frontend (Terminal 2)

```bash
# Mở terminal thứ hai (giữ terminal backend chạy)
cd frontend

# Cài đặt dependencies (chỉ chạy lần đầu)
npm install

# Chạy frontend
npm start
```

**Kết quả mong đợi:**
- Trình duyệt tự động mở: http://localhost:3001
- Giao diện User Management hiển thị

## ✅ Kiểm tra Backend có chạy không?

Mở trình duyệt, vào: http://localhost:3000/users

- Nếu thấy `[]` hoặc danh sách users → Backend OK ✅
- Nếu báo lỗi "Cannot GET" → Backend chưa chạy ❌

## 🔧 Khắc phục lỗi thường gặp

### Lỗi 1: "Cannot connect to backend"
**Nguyên nhân:** Backend chưa chạy
**Giải pháp:** Chạy backend trước (Bước 1)

### Lỗi 2: "MongoDB connection error"
**Nguyên nhân:** Không kết nối được MongoDB
**Giải pháp:** 
- Kiểm tra file `.env` trong thư mục `backend/`
- Đảm bảo có dòng: `MONGODB_URI=mongodb+srv://admin:1234567890@cluster0.fmvyp3m.mongodb.net/groupDB`

### Lỗi 3: "Port 3000 already in use"
**Nguyên nhân:** Port đã được sử dụng
**Giải pháp:**
```bash
# Windows
npx kill-port 3000

# Hoặc đổi port trong file .env
PORT=3001
```

### Lỗi 4: "npm: command not found"
**Nguyên nhân:** Chưa cài Node.js
**Giải pháp:** Tải và cài Node.js từ https://nodejs.org

## 📝 Tóm tắt nhanh

1. **Terminal 1:** `cd backend` → `npm install` → `npm start`
2. **Terminal 2:** `cd frontend` → `npm install` → `npm start`
3. Mở trình duyệt: http://localhost:3001
4. Thêm user và test!

## 🎯 Test thử

1. Nhập Name: "Test User"
2. Nhập Email: "test@example.com"
3. Click "Thêm"
4. User sẽ xuất hiện trong danh sách ✅

Nếu không thêm được → Kiểm tra lại Backend có chạy không!
