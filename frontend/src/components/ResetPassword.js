import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = ({ onBack, onSuccess, initialToken = '' }) => {
  const [formData, setFormData] = useState({
    token: initialToken,
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('❌ Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('❌ Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
        token: formData.token,
        newPassword: formData.newPassword
      });
      
      setMessage('✅ ' + response.data.message);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button onClick={onBack} className="btn btn-secondary back-btn">
          ← Quay lại
        </button>
        <h1>🔐 Đổi mật khẩu</h1>
        <p>Nhập token và mật khẩu mới</p>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>🎫 Reset Token:</label>
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Nhập token reset"
            />
          </div>
          
          <div className="form-group">
            <label>🔒 Mật khẩu mới:</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            />
          </div>
          
          <div className="form-group">
            <label>🔒 Xác nhận mật khẩu:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? '⏳ Đang đổi...' : '🔄 Đổi mật khẩu'}
          </button>
        </form>
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;