// src/pages/Forgotpassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import './Auth.css';

function Forgotpassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email
      });
      
      setMessage(response.data.message || 'Vui lòng kiểm tra email để reset mật khẩu');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔑 Quên mật khẩu</h2>
        <p className="subtitle">Nhập email để nhận link reset mật khẩu</p>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi link reset'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;