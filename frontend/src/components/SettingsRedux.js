import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';
import AvatarUpload from './AvatarUpload';
import RefreshTokenTest from './RefreshTokenTest';
import RateLimitDemo from './RateLimitDemo';

const SettingsRedux = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar || '');

  const handleLogoutAll = () => {
    if (window.confirm('Đăng xuất khỏi tất cả thiết bị?')) {
      dispatch(logoutUser());
      navigate('/login');
    }
  };

  const tabs = [
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'avatar', label: '🖼️ Avatar', icon: '🖼️' },
    { id: 'security', label: '🔒 Security', icon: '🔒' },
    { id: 'tokens', label: '🔑 Tokens', icon: '🔑' },
    { id: 'testing', label: '🧪 Testing', icon: '🧪' }
  ];

  return (
    <div className="settings-container">
      <div className="settings-panel">
        <h2>⚙️ Settings</h2>
        
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-settings">
              <h3>👤 Profile Information</h3>
              <div className="profile-card">
                <div className="profile-field">
                  <label>ID:</label>
                  <span>{user?.id}</span>
                </div>
                <div className="profile-field">
                  <label>Tên:</label>
                  <span>{user?.name}</span>
                </div>
                <div className="profile-field">
                  <label>Email:</label>
                  <span>{user?.email}</span>
                </div>
                <div className="profile-field">
                  <label>Vai trò:</label>
                  <span className={`role-badge ${user?.role}`}>{user?.role}</span>
                </div>
                <div className="profile-field">
                  <label>Permissions:</label>
                  <div className="permissions-list">
                    {user?.permissions?.map(permission => (
                      <span key={permission} className="permission-badge">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <button onClick={() => navigate('/profile')} className="edit-btn">
                ✏️ Edit Profile
              </button>
            </div>
          )}

          {/* Avatar Tab */}
          {activeTab === 'avatar' && (
            <div className="avatar-settings">
              <h3>🖼️ Avatar Settings</h3>
              <AvatarUpload 
                currentAvatar={currentAvatar}
                onAvatarUpdate={(newAvatar) => setCurrentAvatar(newAvatar)}
              />
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="security-settings">
              <h3>🔒 Security Settings</h3>
              
              <div className="security-section">
                <h4>🔑 Password</h4>
                <p>Đổi mật khẩu để bảo mật tài khoản</p>
                <button onClick={() => navigate('/forgot-password')} className="security-btn">
                  🔄 Change Password
                </button>
              </div>

              <div className="security-section">
                <h4>🚪 Sessions</h4>
                <p>Đăng xuất khỏi tất cả thiết bị</p>
                <button onClick={handleLogoutAll} className="danger-btn">
                  🚪 Logout All Devices
                </button>
              </div>

              <div className="security-section">
                <h4>📊 Account Info</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Role:</span>
                    <span className={`role-badge ${user?.role}`}>{user?.role}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Permissions:</span>
                    <span>{user?.permissions?.length || 0} permissions</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tokens Tab */}
          {activeTab === 'tokens' && (
            <div className="tokens-settings">
              <h3>🔑 Token Management</h3>
              <RefreshTokenTest />
            </div>
          )}

          {/* Testing Tab */}
          {activeTab === 'testing' && (
            <div className="testing-settings">
              <h3>🧪 Testing Tools</h3>
              <RateLimitDemo />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsRedux;