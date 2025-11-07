import React, { useState } from 'react';
import { api, TokenManager } from '../services/api';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', formData);
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens
      TokenManager.setTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(user, accessToken);
    } catch (error) {
      setError(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Đăng Nhập</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>
      </form>
      
      <p>
        Chưa có tài khoản? 
        <button type="button" onClick={onSwitchToSignup} className="link-btn">
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
};

export default Login;