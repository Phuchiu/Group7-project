// src/components/Auth/Login.jsx
// Hoạt động 1: Login với Access Token + Refresh Token

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import tokenService from '../../utils/tokenService';
import './Auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.56.1:3000/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error khi user thay đổi input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Sending login request...');
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log('✅ Login response:', response.data);

      const { user, accessToken, refreshToken, token } = response.data;

      // Hoạt động 1: Lưu cả access token VÀ refresh token
      if (accessToken && refreshToken) {
        // Backend trả về accessToken và refreshToken riêng
        console.log('💾 Saving tokens (new format)...');
        tokenService.setTokens(accessToken, refreshToken, user);
      } else if (token) {
        // Backend chỉ trả về token (format cũ)
        console.log('💾 Saving token (old format)...');
        tokenService.setAccessToken(token);
        tokenService.setRefreshToken(token); // Tạm dùng token làm refresh
        tokenService.setUser(user);
      }

      console.log('✅ Tokens saved to localStorage');
      console.log('📦 localStorage state:', {
        accessToken: tokenService.getAccessToken() ? '✓' : '✗',
        refreshToken: tokenService.getRefreshToken() ? '✓' : '✗',
        user: tokenService.getUser() ? '✓' : '✗',
      });

      // Alert thành công
      alert('Đăng nhập thành công!');

      // Redirect theo role
      if (user.role === 'admin') {
        console.log('👤 Admin login → Redirect /admin');
        navigate('/admin');
      } else {
        console.log('👤 User login → Redirect /profile');
        navigate('/profile');
      }

    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">🔐 Đăng nhập</h2>
        
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
          <p>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </p>
        </div>

        {/* Debug info - Chỉ hiển thị khi development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info">
            <h4>🔧 Debug Info (Hoạt động 1)</h4>
            <pre>{JSON.stringify({
              email: formData.email,
              hasAccessToken: !!tokenService.getAccessToken(),
              hasRefreshToken: !!tokenService.getRefreshToken(),
              user: tokenService.getUser()?.name,
            }, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

/*
 * HOẠT ĐỘNG 1: NHỮNG GÌ ĐÃ THAY ĐỔI
 * 
 * 1. Import tokenService
 * 2. Sau khi login thành công:
 *    - Lưu accessToken
 *    - Lưu refreshToken
 *    - Lưu user info
 * 3. Console log để debug
 * 
 * TEST:
 * 1. Đăng nhập
 * 2. F12 → Application → Local Storage
 * 3. Phải thấy:
 *    - accessToken
 *    - refreshToken
 *    - user
 */