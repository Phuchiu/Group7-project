Dưới đây là bản cập nhật **README.md** với nhiều nội dung tiếng Việt hơn và bổ sung phần phân công công việc cho 3 sinh viên (SV1 - Backend, SV2 - Frontend, SV3 - Database/DevOps), giữ nguyên các phần kỹ thuật bằng tiếng Anh để đảm bảo tính chuyên nghiệp.

-----

# 🚀 Group7-project - Hệ Thống Quản Lý Người Dùng Nâng Cao (Advanced User Management System)

## 📋 Giới thiệu Dự án

Đây là một ứng dụng web full-stack hiện đại, tập trung vào quản lý người dùng với các tính năng bảo mật nâng cao, phân quyền chi tiết và trải nghiệm người dùng tối ưu. Dự án được xây dựng trên nền tảng MERN Stack (MongoDB, Express.js, React Redux, Node.js).

**Các tính năng nổi bật:**

  - ✅ **Xác thực & Phân quyền (Authentication & Authorization):** Sử dụng JWT (Access Token + Refresh Token) để bảo mật phiên đăng nhập.
  - ✅ **Phân quyền dựa trên vai trò (RBAC - Role-Based Access Control):** Hệ thống phân cấp rõ ràng gồm Admin (Quản trị viên), Moderator (Điều hành viên), và User (Người dùng thường).
  - ✅ **Quản lý Ảnh đại diện (Avatar Upload):** Cho phép người dùng tải lên ảnh đại diện với cơ chế kiểm tra định dạng và kích thước file chặt chẽ.
  - ✅ **Khôi phục mật khẩu (Password Reset):** Tích hợp gửi email xác thực để người dùng đặt lại mật khẩu khi quên.
  - ✅ **Nhật ký hoạt động (Activity Logging):** Ghi lại lịch sử thao tác của người dùng để phục vụ công tác quản trị và bảo mật.
  - ✅ **Giới hạn truy cập (Rate Limiting):** Bảo vệ hệ thống API khỏi các cuộc tấn công spam hoặc dò mật khẩu (brute-force).
  - ✅ **Bảng điều khiển trực quan (Real-time Dashboard):** Cung cấp cái nhìn tổng quan và thống kê số liệu theo thời gian thực.
  - ✅ **Bảo mật nâng cao (Advanced Security):** Tích hợp nhiều lớp bảo mật như mã hóa mật khẩu (Bcrypt), CORS, và các headers bảo mật.

## 👥 Phân công Thành viên (Team Roles)

Dự án được thực hiện bởi nhóm 3 thành viên với sự phân chia trách nhiệm rõ ràng:

### 👨💻 Đỗ Thành Nhân Tài - Backend Developer

**Trách nhiệm chính:** Xây dựng Server, API và các logic xử lý nghiệp vụ.

  - Thiết kế và triển khai RESTful API.
  - Cấu hình bảo mật: JWT Authentication, Refresh Token, Rate Limiting.
  - Xây dựng các Controller xử lý logic: Auth, User, Profile, Avatar.
  - Tích hợp dịch vụ bên thứ ba: Nodemailer (gửi email), Cloudinary (lưu trữ ảnh).
  - Viết Middleware kiểm tra quyền truy cập (Auth & RBAC).

### 👩💻 Thái Lâm Hồng Phúc - Frontend Developer

**Trách nhiệm chính:** Xây dựng giao diện người dùng và tương tác với API.

  - Thiết kế giao diện hiện đại, responsive với React.js và CSS3.
  - Quản lý trạng thái ứng dụng (State Management) bằng Redux Toolkit.
  - Xây dựng các luồng người dùng: Đăng nhập, Đăng ký, Quên mật khẩu, Dashboard.
  - Tích hợp API vào giao diện, xử lý lỗi và hiển thị thông báo thân thiện.
  - Phát triển các component UI tái sử dụng (AvatarUpload, UserTable...).

### 👨💻 Phạm Thái An) - Database & DevOps Engineer

**Trách nhiệm chính:** Thiết kế cơ sở dữ liệu, triển khai và đảm bảo vận hành hệ thống.

  - Thiết kế Schema MongoDB: User, RefreshToken, ActivityLog.
  - Tối ưu hóa truy vấn cơ sở dữ liệu (Indexing, Aggregation).
  - Thiết lập môi trường triển khai (Deployment) trên Render (Backend) và Vercel (Frontend).
  - Quản lý cấu hình biến môi trường (.env) và bảo mật server.
  - Thực hiện kiểm thử API (Postman Testing) và viết tài liệu kỹ thuật.

-----

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Backend (Server-side)

  - **Node.js & Express.js**: Nền tảng và framework chính để xây dựng server.
  - **MongoDB & Mongoose**: Cơ sở dữ liệu NoSQL và thư viện ODM để làm việc với dữ liệu.
  - **JWT (JSON Web Tokens)**: Cơ chế xác thực bảo mật không trạng thái (stateless).
  - **Bcrypt**: Thư viện mã hóa mật khẩu một chiều an toàn.
  - **Multer**: Middleware xử lý upload file (ảnh avatar).
  - **Nodemailer**: Thư viện gửi email (dùng cho tính năng quên mật khẩu).
  - **Express-rate-limit**: Middleware giới hạn số lượng request để chống spam.

### Frontend (Client-side)

  - **React.js**: Thư viện JavaScript để xây dựng giao diện người dùng tương tác.
  - **Redux Toolkit**: Công cụ quản lý trạng thái (state) tập trung hiệu quả.
  - **React Router**: Thư viện điều hướng trang trong ứng dụng đơn trang (SPA).
  - **Axios**: Thư viện thực hiện các HTTP request đến server.
  - **CSS3**: Ngôn ngữ định kiểu cho giao diện đẹp mắt.

### Database & Services

  - **MongoDB Atlas**: Dịch vụ cơ sở dữ liệu đám mây.
  - **Gmail SMTP / Brevo**: Dịch vụ gửi email giao dịch.
  - **Cloudinary** (Tùy chọn): Dịch vụ lưu trữ và tối ưu hình ảnh đám mây.
  - **Render & Vercel**: Nền tảng triển khai ứng dụng (Backend & Frontend).

-----

## 📁 Cấu trúc Thư mục (Project Structure)


```
Group7-project/
├── backend/                # Mã nguồn Server (Node.js)
│   ├── config/             # Các file cấu hình (Cloudinary, DB...)
│   ├── controllers/        # Logic xử lý nghiệp vụ API
│   ├── middleware/         # Các hàm trung gian (Auth, Upload, RateLimit...)
│   ├── models/             # Định nghĩa Schema MongoDB
│   ├── routes/             # Định nghĩa các đường dẫn API
│   ├── services/           # Các dịch vụ tách biệt (Email, Token...)
│   └── server.js           # File khởi chạy server chính
├── frontend/               # Mã nguồn Client (ReactJS)
│   ├── public/             # File tĩnh (index.html, favicon...)
│   ├── src/
│   │   ├── components/     # Các thành phần giao diện tái sử dụng
│   │   ├── contexts/       # React Context API (nếu dùng thêm)
│   │   ├── services/       # Cấu hình Axios gọi API
│   │   ├── store/          # Cấu hình Redux Store & Slices
│   │   ├── App.js          # Component chính của ứng dụng
│   │   └── index.js        # Điểm bắt đầu của React
└── README.md               # Tài liệu hướng dẫn này
```

-----

## 🚀 Hướng dẫn Cài đặt & Chạy dự án (Setup Guide)

### 1\. Sao chép mã nguồn (Clone Repository)

```bash
git clone https://github.com/Phuchiu/Group7-project.git
cd Group7-project
```

### 2\. Cài đặt và Chạy Backend

```bash
cd backend
npm install      # Cài đặt các thư viện phụ thuộc
npm run dev      # Chạy server ở chế độ development
```

*Server sẽ khởi chạy tại: `http://localhost:3000`*

### 3\. Cài đặt và Chạy Frontend

Mở một terminal mới:

```bash
cd frontend
npm install      # Cài đặt các thư viện phụ thuộc
npm start        # Khởi chạy ứng dụng React
```

*Ứng dụng web sẽ tự động mở tại: `http://localhost:3001`*

### 4\. Cấu hình Biến môi trường (.env)

Tạo file `.env` trong thư mục `backend/` và điền các thông tin bảo mật của bạn:

```env
# Kết nối Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/db_name

# Cấu hình Server
PORT=3000

# Bảo mật JWT (Quan trọng!)
JWT_SECRET=chuoi_bi_mat_cua_ban_cho_access_token
JWT_REFRESH_SECRET=chuoi_bi_mat_cua_ban_cho_refresh_token
JWT_EXPIRE=15m        # Thời gian hết hạn Access Token
JWT_REFRESH_EXPIRE=7d # Thời gian hết hạn Refresh Token

# Cấu hình gửi Email (Chọn 1 trong 2 cách)
# Cách 1: Brevo API (Khuyên dùng cho Render)
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxx
EMAIL_FROM=email_dang_ky_brevo@example.com

# Cách 2: Gmail SMTP (Dùng cho Localhost)
# EMAIL_SERVICE=gmail
# EMAIL_USER=your-gmail@gmail.com
# EMAIL_PASS=mat_khau_ung_dung_16_ky_tu
```

-----

## 🧪 Tài khoản Kiểm thử (Test Accounts)

| Vai trò (Role) | Email | Mật khẩu | Quyền hạn chính |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `123456` | Toàn quyền hệ thống, quản lý tất cả users. |
| **Moderator** | `moderator@example.com` | `moderator123` | Quản lý người dùng thường, xem nhật ký. |
| **User** | `nhantaivang9999@gmail.com` | `123456` | Chỉ quản lý thông tin cá nhân (Profile). |

-----

## 🔗 Triển khai Thực tế (Live Demo)

Dự án đã được triển khai và có thể truy cập trực tuyến tại:

  - **Frontend (Giao diện Web):** [https://group7-project-eight.vercel.app](https://group7-project-eight.vercel.app)
  - **Backend (API Server):** `https://group7-project-g0ww.onrender.com`

*(Lưu ý: Server Backend miễn phí trên Render có thể tự "ngủ đông" sau 15 phút không hoạt động. Lần truy cập đầu tiên có thể mất khoảng 1-2 phút để server khởi động lại. Mong bạn thông cảm đợi giây lát\!)*
