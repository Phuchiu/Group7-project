import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';

const NavigationRedux = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>User Management System</h1>
      </div>
      
      <div className="nav-menu">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}
        >
          📊 Dashboard
        </button>
        
        <button 
          onClick={() => navigate('/profile')}
          className={`nav-btn ${isActive('/profile') ? 'active' : ''}`}
        >
          👤 Profile
        </button>
        
        <button 
          onClick={() => navigate('/users')}
          className={`nav-btn ${isActive('/users') ? 'active' : ''}`}
        >
          👥 Users
        </button>
        
        {(user?.role === 'admin' || user?.role === 'moderator') && (
          <button 
            onClick={() => navigate('/roles')}
            className={`nav-btn ${isActive('/roles') ? 'active' : ''}`}
          >
            🔐 Roles
          </button>
        )}
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => navigate('/admin')}
            className={`nav-btn ${isActive('/admin') ? 'active' : ''}`}
          >
            ⚙️ Admin
          </button>
        )}
        
        {(user?.role === 'admin' || user?.role === 'moderator') && (
          <button 
            onClick={() => navigate('/logs')}
            className={`nav-btn ${isActive('/logs') ? 'active' : ''}`}
          >
            📋 Logs
          </button>
        )}
        
        <button 
          onClick={() => navigate('/settings')}
          className={`nav-btn ${isActive('/settings') ? 'active' : ''}`}
        >
          ⚙️ Settings
        </button>
      </div>
      
      <div className="nav-user">
        <div className="user-info">
          <div className="avatar-display avatar-small">
            <div className="avatar-fallback">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
          <div className="user-details">
            <span className="username">{user?.name}</span>
            <span className={`role-badge ${user?.role}`}>{user?.role}</span>
          </div>
        </div>
        
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default NavigationRedux;