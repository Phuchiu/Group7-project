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
      <h2>Profile - Redux Protected</h2>
      {user && (
        <div className="user-info">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Vai trò:</strong> {user.role}</p>
        </div>
      )}
      
      <div className="actions">
        <button onClick={handleLogout} className="logout-btn">
          Đăng xuất
        </button>
        
        {user?.role === 'admin' && (
          <button onClick={() => navigate('/admin')} className="admin-btn">
            Quản trị
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileRedux;