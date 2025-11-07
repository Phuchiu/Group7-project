// src/components/Profile/Profile.jsx
// Hoạt động 3: Profile với Avatar Upload integration

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import tokenService from '../../utils/tokenService';
import AvatarUpload from './AvatarUpload';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('🔍 Fetching profile...');
      const response = await axiosInstance.get('/profile');
      console.log('✅ Profile data:', response.data);
      setUser(response.data.user);
      setError('');
    } catch (error) {
      console.error('❌ Fetch profile error:', error);
      setError('Không thể tải profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    tokenService.clearTokens();
    alert('Đã đăng xuất!');
    navigate('/login');
  };

  // Hoạt động 3: Callback khi avatar update thành công
  const handleAvatarUpdate = (newAvatarUrl) => {
    console.log('✅ Avatar updated:', newAvatarUrl);
    
    // Update local user state
    setUser({
      ...user,
      avatar: newAvatarUrl,
    });

    // Update localStorage
    const updatedUser = {
      ...user,
      avatar: newAvatarUrl,
    };
    tokenService.setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">⏳ Đang tải profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">❌ {error}</div>
        <button onClick={fetchProfile} className="btn-retry">
          🔄 Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Left Section - Avatar */}
        <div className="profile-left">
          <div className="profile-avatar-section">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="profile-avatar-large"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
            )}
          </div>

          <div className="profile-quick-info">
            <h2>{user?.name}</h2>
            <span className={`role-badge role-${user?.role}`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Right Section - Info & Upload */}
        <div className="profile-right">
          {/* User Info */}
          <div className="profile-info-card">
            <h3>👤 Thông tin cá nhân</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Họ tên:</label>
                <span>{user?.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span className={`role-badge role-${user?.role}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div className="info-item">
                <label>User ID:</label>
                <span className="user-id">{user?._id}</span>
              </div>
            </div>
          </div>

          {/* Hoạt động 3: Avatar Upload Component */}
          <AvatarUpload
            currentAvatar={user?.avatar}
            onAvatarUpdate={handleAvatarUpdate}
          />

          {/* Actions */}
          <div className="profile-actions">
            <button onClick={handleLogout} className="btn-logout">
              🚪 Đăng xuất
            </button>
            <button onClick={fetchProfile} className="btn-refresh">
              🔄 Reload Profile
            </button>
          </div>
        </div>
      </div>

      {/* Debug section */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-section">
          <h3>🔧 Debug Info</h3>
          <div className="debug-info">
            <p><strong>User:</strong></p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <p><strong>Avatar URL:</strong></p>
            <code>{user?.avatar || 'No avatar'}</code>
            <p><strong>Tokens:</strong></p>
            <ul>
              <li>Access Token: {tokenService.getAccessToken() ? '✓' : '✗'}</li>
              <li>Refresh Token: {tokenService.getRefreshToken() ? '✓' : '✗'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

/*
 * HOẠT ĐỘNG 3: PROFILE VỚI AVATAR UPLOAD
 * 
 * Changes:
 * 1. Import AvatarUpload component
 * 2. Pass currentAvatar prop
 * 3. Handle avatar update callback
 * 4. Update local state + localStorage
 * 5. UI layout: Left (avatar) + Right (info + upload)
 * 
 * Flow:
 * 1. User vào /profile
 * 2. Fetch profile data
 * 3. Display current avatar (nếu có)
 * 4. AvatarUpload component cho phép upload mới
 * 5. Sau upload thành công:
 *    - handleAvatarUpdate được gọi
 *    - Update user state với avatar mới
 *    - Update localStorage
 *    - UI re-render với avatar mới
 */