import React, { useState } from 'react';
import api from '../services/api';
import RefreshTokenTest from './RefreshTokenTest';
import AvatarUpload from './AvatarUpload';
import AvatarDisplay from './AvatarDisplay';

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarUpdate = (newAvatarUrl) => {
    setCurrentAvatar(newAvatarUrl);
    const updatedUser = { ...user, avatar: newAvatarUrl };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/api/profile', formData);
      
      const updatedUser = { ...response.data.user, avatar: currentAvatar };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Cập nhật profile thành công!');
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email
    });
    setCurrentAvatar(user.avatar || '');
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="profile">
      <h2>Thông Tin Cá Nhân</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="profile-card">
        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-avatar-section">
              <AvatarDisplay 
                avatar={currentAvatar} 
                name={user.name} 
                size="large" 
              />
            </div>
            <div className="profile-field">
              <label>Họ tên:</label>
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
            <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
              Chỉnh sửa thông tin
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-edit">
            <AvatarUpload 
              currentAvatar={currentAvatar}
              onAvatarUpdate={handleAvatarUpdate}
            />
            <div className="form-group">
              <label>Họ tên:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
              </button>
              <button type="button" onClick={handleCancel}>
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
      
      {process.env.NODE_ENV === 'development' && <RefreshTokenTest />}
    </div>
  );
};

export default Profile;