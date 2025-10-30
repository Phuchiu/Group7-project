import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ onLogout, onBack }) => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar || ''
      });
    } catch (error) {
      setMessage('❌ Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.user);
      setEditMode(false);
      setMessage('✅ Cập nhật thông tin thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Cập nhật thất bại'));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="container">
        <div className="loading">⏳ Đang tải thông tin...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="error">❌ Không thể tải thông tin profile</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-header">
        <button onClick={onBack} className="btn btn-secondary">
          ← Quay lại
        </button>
        <h1>👤 Thông tin cá nhân</h1>
        <button onClick={onLogout} className="btn btn-danger">
          🚀 Đăng xuất
        </button>
      </div>
      
      <div className="profile-container">
        {!editMode ? (
          <div className="profile-view">
            <div className="avatar-section">
              <div className="avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">👤</div>
                )}
              </div>
            </div>
            
            <div className="profile-info">
              <div className="info-item">
                <span className="label">📝 Tên:</span>
                <span className="value">{profile.name}</span>
              </div>
              <div className="info-item">
                <span className="label">📧 Email:</span>
                <span className="value">{profile.email}</span>
              </div>
              <div className="info-item">
                <span className="label">🔑 Vai trò:</span>
                <span className="value">{profile.role === 'admin' ? '🔑 Quản trị viên' : '👤 Người dùng'}</span>
              </div>
              <div className="info-item">
                <span className="label">📅 Ngày tạo:</span>
                <span className="value">{new Date(profile.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
            
            <button onClick={() => setEditMode(true)} className="btn btn-primary">
              ✏️ Chỉnh sửa thông tin
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="profile-form">
            <h3>✏️ Cập nhật thông tin</h3>
            
            <div className="form-group">
              <label>📝 Tên:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Nhập tên của bạn"
              />
            </div>
            
            <div className="form-group">
              <label>📧 Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Nhập email của bạn"
              />
            </div>
            
            <div className="form-group">
              <label>🖼️ Avatar URL (tùy chọn):</label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn btn-success">
                {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary">
                ❌ Hủy
              </button>
            </div>
          </form>
        )}
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;