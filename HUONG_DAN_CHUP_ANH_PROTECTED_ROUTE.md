# 📸 HƯỚNG DẪN CHỤP ẢNH PROTECTED ROUTE

## CHUẨN BỊ

1. **Đăng xuất hoàn toàn:**
```javascript
// Mở Console (F12)
localStorage.clear()
location.reload()
```

2. **Mở Console trước:**
- F12 → Tab "Console"
- Click "Clear console" (icon thùng rác)

---

## 🎯 HÌNH 1: Protected Route - Redirect khi CHƯA LOGIN

### Các bước:

**Bước 1:** Đảm bảo đã logout
```javascript
localStorage.clear()
```

**Bước 2:** Mở Console (F12 → Console)

**Bước 3:** Vào URL: `http://localhost:3001/profile`

**Bước 4:** Sẽ thấy:
```
🔐 ProtectedRoute check: {
  isAuthenticated: false,
  hasToken: false,
  timestamp: "..."
}
❌ Not authenticated → Redirect to /login
```

**Bước 5:** Popup hiện: "⚠️ BẠN CHƯA ĐĂNG NHẬP!"

**Bước 6:** CHỤP ẢNH:
- Console có log "❌ Not authenticated"
- Popup cảnh báo
- URL bar đang redirect về /login

---

## 🎯 HÌNH 2: Admin Route - User thường bị chặn

### Các bước:

**Bước 1:** Đăng nhập với USER THƯỜNG (không phải admin)

**Bước 2:** Mở Console (F12 → Console) → Clear

**Bước 3:** Vào URL: `http://localhost:3001/admin`

**Bước 4:** Sẽ thấy:
```
👑 AdminRoute check: {
  isAuthenticated: true,
  hasToken: true,
  userRole: "user",
  timestamp: "..."
}
🚫 Not admin (role: user) → Redirect to /profile
```

**Bước 5:** Popup hiện: "⚠️ KHÔNG CÓ QUYỀN TRUY CẬP!"

**Bước 6:** CHỤP ẢNH:
- Console có log "🚫 Not admin"
- Popup cảnh báo
- URL bar đang redirect về /profile

---

## 🎯 HÌNH 3: Admin Route - Admin được phép

### Các bước:

**Bước 1:** Đăng nhập với ADMIN

**Bước 2:** Mở Console (F12 → Console) → Clear

**Bước 3:** Vào URL: `http://localhost:3001/admin`

**Bước 4:** Sẽ thấy:
```
👑 AdminRoute check: {
  isAuthenticated: true,
  hasToken: true,
  userRole: "admin",
  timestamp: "..."
}
✅ Admin authenticated → Allow access
```

**Bước 5:** Trang Admin Dashboard hiển thị

**Bước 6:** CHỤP ẢNH:
- Console có log "✅ Admin authenticated"
- Trang Admin Dashboard
- URL bar: /admin

---

## 💡 MẸO CHỤP ẢNH ĐẸP

1. **Zoom Console:**
   - Ctrl + (phóng to)
   - Ctrl - (thu nhỏ)

2. **Highlight log quan trọng:**
   - Click vào log để highlight

3. **Chụp toàn màn hình:**
   - Win + Shift + S (Windows)
   - Cmd + Shift + 4 (Mac)

4. **Chụp cả popup + console:**
   - Đợi popup hiện
   - Chụp nhanh trước khi click OK

---

## ✅ CHECKLIST

- [ ] Hình 1: Console log "❌ Not authenticated"
- [ ] Hình 1: Popup "BẠN CHƯA ĐĂNG NHẬP"
- [ ] Hình 1: URL redirect về /login
- [ ] Hình 2: Console log "🚫 Not admin"
- [ ] Hình 2: Popup "KHÔNG CÓ QUYỀN"
- [ ] Hình 2: URL redirect về /profile
- [ ] Hình 3: Console log "✅ Admin authenticated"
- [ ] Hình 3: Admin Dashboard hiển thị

---

## 🔧 NẾU KHÔNG THẤY LOG

**Nguyên nhân:** Console bị clear tự động

**Giải pháp:**
1. F12 → Console
2. Click icon ⚙️ (Settings)
3. Bật "Preserve log"
4. Thử lại

---

## 📝 GHI CHÚ

- Log sẽ hiện MỖI LẦN component render
- Nếu log bị scroll, kéo lên trên
- Nếu muốn log rõ hơn, thêm `debugger;` vào code
