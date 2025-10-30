// src/pages/Usersdashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import './Userdashboard.css';

function Usersdashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  const checkAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này');
      navigate('/profile');
      return;
    }
    setCurrentUser(user);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch users error:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
      alert('Xóa user thành công!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Lỗi khi xóa user');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/users/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      alert('Cập nhật vai trò thành công!');
    } catch (error) {
      console.error('Update role error:', error);
      alert('Lỗi khi cập nhật vai trò');
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>👑 Quản lý Users (Admin)</h2>
        <button onClick={() => navigate('/profile')} className="btn-back">
          ← Về Profile
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Tổng Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Admin</h3>
          <p>{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="stat-card">
          <h3>User</h3>
          <p>{users.filter(u => u.role === 'user').length}</p>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Avatar</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
                  {user.avatar ? (
                    <img 
                      src={`${API_URL}${user.avatar}`} 
                      alt="Avatar" 
                      className="table-avatar"
                    />
                  ) : (
                    <div className="table-avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={user._id === currentUser?._id}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={user._id === currentUser?._id}
                    className="btn-delete"
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Usersdashboard;