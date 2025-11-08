import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Token không hợp lệ');
    }
  }, [token]);

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      navigate('/');
    }
  }, [isSuccess, countdown, navigate]);

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'Yếu';
    if (password.length < 8) return 'Trung bình';
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)) {
      return 'Mạnh';
    }
    return 'Khá';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const validateForm = () => {
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu mới');
      return false;
    }
    
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    if (!confirmPassword.trim()) {
      setError('Vui lòng xác nhận mật khẩu');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, {
        password: password.trim()
      });
      setMessage(response.data.message);
      setIsSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-form success-form">
          <div className="success-icon">✓</div>
          <h2>Mật khẩu đã được đặt lại!</h2>
          <p className="success-message">{message}</p>
          <p className="redirect-message">
            Bạn sẽ được chuyển hướng đến trang đăng nhập trong {countdown} giây...
          </p>
          <button 
            type="button" 
            className="login-now-btn"
            onClick={() => navigate('/')}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Đặt lại mật khẩu</h2>
        
        <p className="reset-password-description">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
        
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu mới"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {password && (
              <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Độ mạnh: {passwordStrength}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <div className="password-mismatch">
                Mật khẩu không khớp
              </div>
            )}
          </div>
          
          <div className="password-requirements">
            <p>Mật khẩu phải có:</p>
            <ul>
              <li className={password.length >= 6 ? 'valid' : ''}>Ít nhất 6 ký tự</li>
              <li className={password.match(/[A-Z]/) ? 'valid' : ''}>Một chữ cái viết hoa</li>
              <li className={password.match(/[0-9]/) ? 'valid' : ''}>Một chữ số</li>
            </ul>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !password || !confirmPassword || password !== confirmPassword}
            className="reset-password-btn"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Đang cập nhật...
              </>
            ) : (
              'Đặt lại mật khẩu'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            <button 
              type="button" 
              className="link-btn"
              onClick={() => navigate('/')}
            >
              Quay lại trang đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;