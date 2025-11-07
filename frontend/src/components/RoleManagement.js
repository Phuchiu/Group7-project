import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/rbac/stats')
      ]);
      
      setUsers(usersResponse.data.users);
      setStats(statsResponse.data.stats);
    } catch (error) {
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setError('');
      setSuccess('');
      
      await api.put(`/api/rbac/users/${userId}/role`, { role: newRole });
      
      setSuccess(`Đã cập nhật role thành ${newRole}`);
      fetchData(); // Refresh data
    } catch (error) {
      setError(error.response?.data?.message || 'Không thể cập nhật role');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'moderator': return 'role-badge moderator';
      default: return 'role-badge user';
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="role-management">
      <h2>🔐 Role Management (Admin Only)</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Role Statistics */}
      {stats && (
        <div className="role-stats">
          <h3>📊 Thống kê Role</h3>
          <div className="stats-grid">
            <div className="stat-card admin">
              <h4>Admin</h4>
              <div className="stat-number">{stats.admin}</div>
            </div>
            <div className="stat-card moderator">
              <h4>Moderator</h4>
              <div className="stat-number">{stats.moderator}</div>
            </div>
            <div className="stat-card user">
              <h4>User</h4>
              <div className="stat-number">{stats.user}</div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-role-table">
        <h3>👥 Quản lý Role Users</h3>
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Role hiện tại</th>
              <th>Thay đổi Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={getRoleBadgeClass(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="role-actions">
                    {user.role !== 'user' && (
                      <button 
                        onClick={() => updateUserRole(user._id, 'user')}
                        className="role-btn user"
                      >
                        → User
                      </button>
                    )}
                    {user.role !== 'moderator' && (
                      <button 
                        onClick={() => updateUserRole(user._id, 'moderator')}
                        className="role-btn moderator"
                      >
                        → Moderator
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => updateUserRole(user._id, 'admin')}
                        className="role-btn admin"
                      >
                        → Admin
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManagement;