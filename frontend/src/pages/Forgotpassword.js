// src/pages/Forgotpassword.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import './Auth.css';

function Forgotpassword() {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập mã
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
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
      
      setMessage(response.data.message);
      setStep(2);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!token || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/reset-password/${token}`, {
        password: newPassword
      });
      
      alert('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔑 Quên mật khẩu</h2>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        {step === 1 ? (
          <>
            <p className="subtitle">Nhập email để nhận mã xác nhận</p>
            <form onSubmit={handleSendCode}>
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
                {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="subtitle">Nhập mã xác nhận từ email và mật khẩu mới</p>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>Mã xác nhận (6 số):</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Nhập mã 6 số"
                  maxLength="6"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                style={{ marginTop: '10px', background: '#999' }}
              >
                ← Gửi lại mã
              </button>
            </form>
          </>
        )}

        <div className="auth-links">
          <Link to="/login">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;