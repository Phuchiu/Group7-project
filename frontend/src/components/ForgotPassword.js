import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = ({ onBack }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: email.trim().toLowerCase()
      });
      setMessage(response.data.message);
      setEmailSent(true);
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi gửi email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setMessage('');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Quên mật khẩu</h2>
        
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        {!emailSent ? (
          <>
            <p className="forgot-password-description">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
              </div>
              
              <button type="submit" disabled={loading || !email.trim()}>
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi email đặt lại mật khẩu'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="email-sent-confirmation">
            <div className="success-icon">✉️</div>
            <h3>Email đã được gửi!</h3>
            <p>
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn. 
              Vui lòng kiểm tra hòm thư và làm theo hướng dẫn.
            </p>
            <div className="email-actions">
              <button type="button" className="resend-btn" onClick={handleResendEmail}>
                Gửi lại email
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/reset-password', { state: { email: email } })}
                className="enter-code-btn"
                style={{ 
                  marginTop: '10px', 
                  padding: '10px 20px', 
                  background: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  width: '100%' 
                }}
              >
                👉 Nhập mã xác nhận ngay
              </button>
            </div>
          </div>
        )}

        <div className="auth-footer">
          <p>
            Nhớ mật khẩu?
            <button type="button" className="link-btn" onClick={onBack}>
              Quay lại đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;