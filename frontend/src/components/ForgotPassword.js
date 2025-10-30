import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = ({ onBack, onResetToken }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/auth/forgot-password', {
        email
      });
      
      setResetToken(response.data.resetToken);
      setMessage('✅ ' + response.data.message);
      onResetToken(response.data.resetToken);
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
        <h1>🔑 Quên mật khẩu</h1>
        <p>Nhập email để nhận token reset mật khẩu</p>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📧 Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="Nhập email của bạn"
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? '⏳ Đang gửi...' : '📤 Gửi token reset'}
          </button>
        </form>
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        {resetToken && (
          <div className="token-display">
            <h3>🎫 Reset Token</h3>
            <div className="token-box">
              <code>{resetToken}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(resetToken)}
                className="btn btn-secondary btn-small"
              >
                📋 Copy
              </button>
            </div>
            <p className="token-note">
              ⏰ Token có hiệu lực trong 10 phút. Sử dụng token này để đổi mật khẩu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;