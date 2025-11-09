import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPasswordOTP = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp');
    }

    if (formData.password.length < 6) {
      return setError('Mật khẩu phải có ít nhất 6 ký tự');
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/auth/reset-password', {
        email: formData.email,
        code: formData.code,
        password: formData.password
      });
      
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>🔑 Đặt lại mật khẩu</h2>
        
        <p className="reset-description">
          Nhập email, mã xác nhận từ email và mật khẩu mới
        </p>
        
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email của bạn"
              value={formData.email} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input 
              type="text" 
              name="code" 
              placeholder="Mã xác nhận (6 số)"
              value={formData.code} 
              onChange={handleChange} 
              required 
              maxLength="6"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              name="password" 
              placeholder="Mật khẩu mới"
              value={formData.password} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Xác nhận mật khẩu mới"
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            <button 
              type="button" 
              className="link-btn"
              onClick={() => navigate('/login')}
            >
              Quay lại đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordOTP;