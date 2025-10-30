import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email
      });
    } catch (error) {
      setMessage('Không thể tải thông tin profile');
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
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.user);
      setEditMode(false);
      setMessage('Cập nhật thông tin thành công!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  if (!profile) return <div>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Thông tin cá nhân</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
          Đăng xuất
        </button>
      </div>
      
      {!editMode ? (
        <div>
          <p><strong>Tên:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Vai trò:</strong> {profile.role}</p>
          <p><strong>Ngày tạo:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          <button onClick={() => setEditMode(true)} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
            Chỉnh sửa
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '15px' }}>
            <label>Tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
          </div>
          <div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', marginRight: '10px' }}>
              Lưu
            </button>
            <button type="button" onClick={() => setEditMode(false)} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none' }}>
              Hủy
            </button>
          </div>
        </form>
      )}
      
      {message && <p style={{ marginTop: '15px', color: message.includes('thành công') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default Profile;