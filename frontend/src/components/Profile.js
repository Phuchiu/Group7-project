import React, { useState } from 'react';
import api from '../services/api';
import RefreshTokenTest from './RefreshTokenTest';

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await api.put('/api/profile', formDataToSend, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
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
    setAvatarFile(null);
    setAvatarPreview(user.avatar || '');
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
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
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
            <div className="form-group">
              <label>Avatar:</label>
              <div className="avatar-upload">
                {avatarPreview && (
                  <img src={avatarPreview} alt="Preview" className="avatar-preview" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="avatar-input"
                />
              </div>
            </div>
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