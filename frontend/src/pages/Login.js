// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    try {
      setLoading(true);

      const loginData = { email, password };
      
      console.log('🚀 Sending login request to:', API_ENDPOINTS.AUTH.LOGIN);
      console.log('📦 Data:', { email, password: '***' });

      // Call API login
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, loginData);

      console.log('✅ Login successful:', response.data);

      // Lưu token và user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log('💾 Saved to localStorage:', {
        token: '✓',
        user: response.data.user
      });

      // Hiển thị thông báo thành công
      alert(`Đăng nhập thành công! Xin chào ${response.data.user.name}`);
      
      // Redirect dựa vào role
      if (response.data.user.role === 'admin') {
        console.log('👨‍💼 Redirecting to admin dashboard...');
        navigate('/admin');
      } else {
        console.log('👤 Redirecting to profile...');
        navigate('/profile');
      }
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err.message);
      
      // Hiển thị lỗi chi tiết
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      
      // Log thêm để debug
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err.request) {
        console.error('No response received. Backend có đang chạy không?');
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 Đăng nhập</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Nhập email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Nhập mật khẩu"
              disabled={loading}
              required
              minLength="6"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
          <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;