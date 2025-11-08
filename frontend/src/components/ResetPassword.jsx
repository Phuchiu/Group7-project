// src/components/Auth/ResetPassword.jsx
// Hoạt động 4: Form đổi password mới với reset token

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const API_URL = 'http://192.168.56.1:3000/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validate token khi component mount
  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      console.log('🔍 Validating reset token:', token);
      
      // Optional: Có thể có API validate token trước
      // await axios.get(`${API_URL}/auth/validate-reset-token/${token}`);
      
      setTokenValid(true);
      console.log('✅ Token valid');
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      setTokenValid(false);
      setError('Link reset password không hợp lệ hoặc đã hết hạn.');
    } finally {
      setValidating(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Resetting password with token:', token);

      const response = await axios.post(
        `${API_URL}/auth/reset-password/${token}`,
        {
          password: formData.password,
        }
      );

      console.log('✅ Reset password success:', response.data);
      
      setSuccess(true);

      // Auto redirect sau 3 giây
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('❌ Reset password error:', error);
      const errorMessage = 
        error.response?.data?.message || 
        'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (validating) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang xác thực link reset password...</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2>Link không hợp lệ</h2>
            <p>{error}</p>
            
            <div className="error-reasons">
              <h3>Nguyên nhân có thể:</h3>
              <ul>
                <li>Link đã hết hạn (chỉ có hiệu lực 1 giờ)</li>
                <li>Link đã được sử dụng rồi</li>
                <li>Link bị sai/không đầy đủ</li>
              </ul>
            </div>

            <div className="auth-actions">
              <Link to="/forgot-password" className="btn-primary">
                📧 Gửi lại email reset
              </Link>
              <Link to="/login" className="btn-secondary">
                🔐 Về trang đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Đổi mật khẩu thành công!</h2>
            <p>Mật khẩu của bạn đã được cập nhật.</p>
            
            <div className="redirect-info">
              <p>Đang chuyển về trang đăng nhập trong 3 giây...</p>
              <div className="countdown-bar"></div>
            </div>

            <Link to="/login" className="btn-primary">
              🔐 Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Đặt lại mật khẩu</h2>
          <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">Mật khẩu mới</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              required
              disabled={loading}
              autoFocus
              minLength={6}
            />
            <small className="form-hint">
              Mật khẩu phải có ít nhất 6 ký tự
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              required
              disabled={loading}
              minLength={6}
            />
            {formData.confirmPassword && (
              <small className={
                formData.password === formData.confirmPassword
                  ? 'form-hint success'
                  : 'form-hint error'
              }>
                {formData.password === formData.confirmPassword
                  ? '✓ Mật khẩu khớp'
                  : '✗ Mật khẩu không khớp'}
              </small>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading || !formData.password || !formData.confirmPassword}
          >
            {loading ? '⏳ Đang xử lý...' : '🔐 Đặt lại mật khẩu'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            <Link to="/login">← Quay lại đăng nhập</Link>
          </p>
        </div>

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info">
            <h4>🔧 Debug - Hoạt động 4</h4>
            <p><strong>Reset Token:</strong></p>
            <code>{token}</code>
            <p><strong>Password:</strong> {formData.password ? '***' : 'Empty'}</p>
            <p><strong>Confirm:</strong> {formData.confirmPassword ? '***' : 'Empty'}</p>
            <p><strong>Match:</strong> {formData.password === formData.confirmPassword ? '✓' : '✗'}</p>
            <p><strong>API endpoint:</strong> POST {API_URL}/auth/reset-password/{token}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

/*
 * HOẠT ĐỘNG 4: RESET PASSWORD
 * 
 * Flow:
 * 1. User click link trong email: /reset-password/{token}
 * 2. Component mount → Validate token
 * 3. Nếu token hợp lệ → Show form
 * 4. User nhập password mới và confirm
 * 5. Validate: password match, >= 6 chars
 * 6. Submit: POST /api/auth/reset-password/{token}
 * 7. Backend:
 *    - Validate token
 *    - Check expiry time
 *    - Hash password mới
 *    - Update user password
 *    - Xóa/invalidate reset token
 * 8. Success → Auto redirect /login
 * 
 * Backend API cần:
 * POST /api/auth/reset-password/:token
 * Body: { password: "newpassword123" }
 * Response: { message: "Password reset successfully" }
 * 
 * Optional:
 * GET /api/auth/validate-reset-token/:token
 * Response: { valid: true/false }
 */