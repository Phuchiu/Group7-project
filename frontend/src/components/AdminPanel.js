import React, { useState, useEffect } from 'react';
import { useRole } from '../contexts/RoleContext';
import api from '../services/api';

const AdminPanel = () => {
  const { hasRole, hasAnyRole } = useRole();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Debug: Check user role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('AdminPanel - Current user:', user);
  console.log('AdminPanel - Has admin role:', hasRole('admin'));
  
  // Check if user has admin access
  if (!hasRole('admin') && !hasAnyRole(['admin', 'moderator'])) {
    return (
      <div className="admin-panel">
        <div className="error">
          <h3>Bạn không có quyền truy cập trang này.</h3>
          <p>Chỉ Admin hoặc Moderator mới có thể truy cập trang này.</p>
          <p>Role hiện tại: {user.role || 'Không xác định'}</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        api.get('/api/users/stats'),
        api.get('/api/users')
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
        await api.delete(`/api/users/${userId}`);
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
      
      {/* Debug Info */}
      <div style={{background: '#f0f0f0', padding: '10px', marginBottom: '20px', fontSize: '12px'}}>
        <strong>Debug Info:</strong><br/>
        User: {user.name} ({user.email})<br/>
        Role: {user.role}<br/>
        Has Admin: {hasRole('admin') ? 'Yes' : 'No'}<br/>
        Has Any Role: {hasAnyRole(['admin', 'moderator']) ? 'Yes' : 'No'}
      </div>
      
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