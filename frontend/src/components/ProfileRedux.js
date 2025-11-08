import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';

const ProfileRedux = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile">
        <h2>Profile - Redux Protected</h2>
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
  );}
};

export default ProfileRedux;