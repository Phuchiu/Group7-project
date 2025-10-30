import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('login');
  };

  if (user) {
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
        
        <button onClick={handleLogout} className="btn btn-danger">
          🚀 Đăng xuất
        </button>
      </div>
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
        <Login onLogin={handleLogin} />
      ) : (
        <Signup onSignup={handleSignup} />
      )}
    </div>
  );
}

export default App;
