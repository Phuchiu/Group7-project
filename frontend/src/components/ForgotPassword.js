import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = ({ onBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Vui lòng nhập email'); return; }
    
    setLoading(true); setError(''); setMessage('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setMessage('✅ Mã xác nhận 6 số đã được gửi đến email của bạn!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tìm thấy email này');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || !password) { setError('Vui lòng nhập đủ mã và mật khẩu mới'); return; }

    setLoading(true); setError(''); setMessage('');
    try {
      await api.post('/api/auth/reset-password', { email, code, password });
      setMessage('🎉 Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...');
      setTimeout(() => {
         if (onBack) {
             onBack();
         } else {
             navigate('/login');
         }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Mã xác nhận sai hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{step === 1 ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}</h2>
        
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        {step === 1 ? (
          <>
            <p className="forgot-password-description">
              Nhập email của bạn để nhận mã xác nhận 6 số.
            </p>
            <form onSubmit={handleSendEmail}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoFocus
                  required
                />
              </div>
              <button type="submit" disabled={loading || !email.trim()}>
                {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
              </button>
            </form>
          </>
        ) : (
          <>
             <p className="forgot-password-description">
              Vui lòng kiểm tra email <strong>{email}</strong> và nhập mã 6 số vào bên dưới.
              <br/>
              <small>(<button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#667eea', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontFamily: 'inherit' }}
              >
                Nhập lại email khác
              </button>)</small>
            </p>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Mã xác nhận (6 số)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading}
                  required
                  maxLength="6"
                  style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '18px' }}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength="6"
                />
              </div>
              <button type="submit" disabled={loading || !code || !password}>
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </form>
             <button type="button" className="link-btn" onClick={handleSendEmail} disabled={loading} style={{marginTop: '10px', fontSize: '14px'}}>
                Gửi lại mã
             </button>
          </>
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