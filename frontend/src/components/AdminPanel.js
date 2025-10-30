import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/users/stats', { headers }),
        axios.get('http://localhost:3000/api/users', { headers })
      ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error('Admin panel error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Không thể tải dữ liệu admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng ${userName}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData(); // Refresh data
      } catch (error) {
        setError(error.response?.data?.message || 'Không thể xóa người dùng');
      }
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      {error && <div className="error">{error}</div>}

      {/* Statistics */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tổng người dùng</h3>
            <div className="stat-number">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <h3>Admin</h3>
            <div className="stat-number">{stats.adminCount}</div>
          </div>
          <div className="stat-card">
            <h3>User thường</h3>
            <div className="stat-number">{stats.userCount}</div>
          </div>
        </div>
      )}

      {/* Users Management */}
      <div className="admin-users">
        <h3>Quản lý người dùng</h3>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className="delete-btn"
                      disabled={user.role === 'admin'}
                    >
                      {user.role === 'admin' ? 'Không thể xóa' : 'Xóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;