import React, { useState } from 'react';
import { api, TokenManager } from '../services/api';

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await api.post('/api/auth/signup', formData);
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens
      TokenManager.setTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      onSignup(user, accessToken);
    } catch (error) {
      setError(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Đăng Ký</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
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
          {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
        </button>
      </form>
      
      <p>
        Đã có tài khoản? 
        <button type="button" onClick={onSwitchToLogin} className="link-btn">
          Đăng nhập ngay
        </button>
      </p>
    </div>
  );
};

export default Signup;