import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UploadAvatar from './components/UploadAvatar';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('login');
    setCurrentPage('dashboard');
  };

  if (user) {
    if (currentPage === 'profile') {
      return (
        <Profile 
          onLogout={handleLogout} 
          onBack={() => setCurrentPage('dashboard')}
        />
      );
    }
    
    if (currentPage === 'admin') {
      return (
        <AdminPanel 
          onLogout={handleLogout} 
          onBack={() => setCurrentPage('dashboard')}
        />
      );
    }
    
    if (currentPage === 'upload-avatar') {
      return (
        <UploadAvatar 
          onBack={() => setCurrentPage('dashboard')}
          onSuccess={() => setCurrentPage('dashboard')}
        />
      );
    }
    
    return (
      <div className="welcome">
        <h1>🎉 Chào mừng trở lại!</h1>
        <p>Bạn đã đăng nhập thành công vào hệ thống</p>
        
        {user.name && (
          <div className="user-info">
            <h3>👤 Thông tin tài khoản</h3>
            <div className="user-detail">
              <strong>Tên:</strong>
              <span>{user.name}</span>
            </div>
            <div className="user-detail">
              <strong>Email:</strong>
              <span>{user.email}</span>
            </div>
            <div className="user-detail">
              <strong>Vai trò:</strong>
              <span>{user.role === 'admin' ? '🔑 Quản trị viên' : '👤 Người dùng'}</span>
            </div>
          </div>
        )}
        
        <div className="dashboard-actions">
          <button onClick={() => setCurrentPage('profile')} className="btn btn-primary">
            👤 Quản lý thông tin cá nhân
          </button>
          <button onClick={() => setCurrentPage('upload-avatar')} className="btn btn-info">
            🖼️ Upload Avatar
          </button>
          {user.role === 'admin' && (
            <button onClick={() => setCurrentPage('admin')} className="btn btn-success">
              🔐 Quản lý người dùng
            </button>
          )}
          <button onClick={handleLogout} className="btn btn-danger">
            🚀 Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  if (view === 'forgot-password') {
    return (
      <ForgotPassword 
        onBack={() => setView('login')}
        onResetToken={(token) => {
          setResetToken(token);
          setView('reset-password');
        }}
      />
    );
  }
  
  if (view === 'reset-password') {
    return (
      <ResetPassword 
        onBack={() => setView('login')}
        onSuccess={() => setView('login')}
        initialToken={resetToken}
      />
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>💼 User Management</h1>
        <p>Hệ thống quản lý người dùng hiện đại</p>
      </div>
      
      <div className="tabs">
        <button 
          onClick={() => setView('login')}
          className={`tab ${view === 'login' ? 'active' : ''}`}
        >
          🔑 Đăng nhập
        </button>
        <button 
          onClick={() => setView('signup')}
          className={`tab ${view === 'signup' ? 'active' : ''}`}
        >
          ✨ Đăng ký
        </button>
      </div>
      
      {view === 'login' ? (
        <div>
          <Login onLogin={handleLogin} />
          <div className="forgot-password-link">
            <button 
              onClick={() => setView('forgot-password')}
              className="link-button"
            >
              🔑 Quên mật khẩu?
            </button>
          </div>
        </div>
      ) : (
        <Signup onSignup={handleSignup} />
      )}
    </div>
  );
}

export default App;
