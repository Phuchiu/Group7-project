import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';

const ProfileRedux = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarKey, setAvatarKey] = useState(Date.now());

  // Force re-render when user.avatar changes
  useEffect(() => {
    setAvatarKey(Date.now());
  }, [user?.avatar]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile">
        <h2>Profile - Redux Protected</h2>
        
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="avatar-display avatar-large">
            {user?.avatar ? (
              <img 
                key={avatarKey}
                src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:3000${user.avatar}?t=${avatarKey}`} 
                alt="Avatar" 
                className="avatar-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="avatar-fallback"
              style={{ display: user?.avatar ? 'none' : 'flex' }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
        
        {user && (
          <div className="profile-card">
            <div className="profile-field">
              <label>ID:</label>
              <span>{user.id}</span>
            </div>
            <div className="profile-field">
              <label>Tên:</label>
              <span>{user.name}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="profile-field">
              <label>Vai trò:</label>
              <span className={`role ${user.role}`}>{user.role}</span>
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <button onClick={handleLogout} className="delete-btn">
            Đăng xuất
          </button>
          
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="edit-btn">
              Quản trị
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileRedux;