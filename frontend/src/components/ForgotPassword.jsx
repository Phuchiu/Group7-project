// src/components/Auth/ForgotPassword.jsx
// Hoạt động 4: Form nhập email để reset password

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const API_URL = 'http://192.168.56.1:3000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('📧 Sending forgot password request for:', email);
      
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      console.log('✅ Forgot password success:', response.data);
      
      setMessage(
        'Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn để lấy link reset password.'
      );
      setSubmitted(true);

    } catch (error) {
      console.error('❌ Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Gửi email thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Email đã được gửi!</h2>
            <p>{message}</p>
            
            <div className="next-steps">
              <h3>📋 Bước tiếp theo:</h3>
              <ol>
                <li>Mở email của bạn (<strong>{email}</strong>)</li>
                <li>Tìm email từ "User Management System"</li>
                <li>Click vào link trong email</li>
                <li>Nhập mật khẩu mới</li>
              </ol>
            </div>

            <div className="help-text">
              <p>⚠️ <strong>Lưu ý:</strong></p>
              <ul>
                <li>Link chỉ có hiệu lực trong 1 giờ</li>
                <li>Kiểm tra cả folder Spam/Junk</li>
                <li>Email có thể mất vài phút để đến</li>
              </ul>
            </div>

            <div className="auth-actions">
              <button 
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
              >
                ⬅️ Gửi lại email
              </button>
              <Link to="/login" className="btn-primary">
                🔐 Về trang đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔒 Quên mật khẩu</h2>
          <p>Nhập email của bạn để nhận link reset password</p>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={loading}
              autoFocus
            />
            <small className="form-hint">
              Nhập email bạn đã dùng để đăng ký tài khoản
            </small>
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading || !email}
          >
            {loading ? '⏳ Đang gửi...' : '📧 Gửi email reset password'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Nhớ lại mật khẩu? <Link to="/login">Đăng nhập</Link>
          </p>
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info">
            <h4>🔧 Debug - Hoạt động 4</h4>
            <p><strong>Email:</strong> {email || 'Chưa nhập'}</p>
            <p><strong>API endpoint:</strong> POST {API_URL}/auth/forgot-password</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

/*
 * HOẠT ĐỘNG 4: FORGOT PASSWORD
 * 
 * Flow:
 * 1. User nhập email
 * 2. Submit form
 * 3. POST /api/auth/forgot-password
 * 4. Backend:
 *    - Tìm user theo email
 *    - Generate reset token (JWT hoặc random string)
 *    - Lưu token vào DB với expiry time (1 giờ)
 *    - Gửi email với link: /reset-password/{token}
 * 5. Frontend: Show success message với hướng dẫn
 * 
 * Backend API cần:
 * POST /api/auth/forgot-password
 * Body: { email: "user@email.com" }
 * Response: { message: "Email sent successfully" }
 */