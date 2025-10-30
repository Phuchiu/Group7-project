// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch profile error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 Hồ sơ cá nhân</h2>
        
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={`${API_URL}${user.avatar}`} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="info-row">
            <label>Họ tên:</label>
            <span>{user.name}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <label>Vai trò:</label>
            <span className={`role-badge ${user.role}`}>
              {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            </span>
          </div>
          <div className="info-row">
            <label>Ngày tạo:</label>
            <span>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate('/upload-avatar')} className="btn-upload">
            📷 Cập nhật ảnh đại diện
          </button>
          <button onClick={() => navigate('/reset-password')} className="btn-reset">
            🔑 Đổi mật khẩu
          </button>
          {user.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="btn-admin">
              👑 Quản lý Admin
            </button>
          )}
          <button onClick={handleLogout} className="btn-logout">
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;