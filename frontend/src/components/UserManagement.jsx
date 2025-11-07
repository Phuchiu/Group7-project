// src/components/Admin/UserManagement.jsx
// Hoạt động 2: RBAC - Quản lý users (Admin only)

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './Admin.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('📥 Fetching users...');
      const response = await axiosInstance.get('/users');
      console.log('✅ Users fetched:', response.data);
      setUsers(response.data.users || response.data);
      setError('');
    } catch (error) {
      console.error('❌ Fetch users error:', error);
      setError('Không thể tải danh sách users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log(`🔄 Changing role for user ${userId} to ${newRole}`);
      await axiosInstance.put(`/users/${userId}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      alert(`Đã thay đổi role thành ${newRole}`);
      console.log('✅ Role changed successfully');
    } catch (error) {
      console.error('❌ Change role error:', error);
      alert('Thay đổi role thất bại');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) {
      return;
    }

    try {
      console.log(`🗑️ Deleting user ${userId}`);
      await axiosInstance.delete(`/users/${userId}`);
      
      // Remove from local state
      setUsers(users.filter(user => user._id !== userId));
      
      alert('Đã xóa user thành công');
      console.log('✅ User deleted');
    } catch (error) {
      console.error('❌ Delete user error:', error);
      alert('Xóa user thất bại');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'moderator':
        return 'badge-moderator';
      case 'user':
      default:
        return 'badge-user';
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">⏳ Đang tải danh sách users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error">❌ {error}</div>
        <button onClick={fetchUsers} className="btn-retry">
          🔄 Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>👥 User Management</h2>
        <button onClick={fetchUsers} className="btn-refresh">
          🔄 Refresh
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="stat-label">Admins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {users.filter(u => u.role === 'moderator').length}
          </div>
          <div className="stat-label">Moderators</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {users.filter(u => u.role === 'user').length}
          </div>
          <div className="stat-label">Users</div>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Change Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <strong>{user.name}</strong>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role?.toUpperCase()}
                  </span>
                </td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="btn-delete"
                    title="Delete user"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-section">
          <h3>🔧 Debug - Hoạt động 2</h3>
          <div className="debug-info">
            <p><strong>Total users:</strong> {users.length}</p>
            <p><strong>Roles distribution:</strong></p>
            <ul>
              <li>Admin: {users.filter(u => u.role === 'admin').length}</li>
              <li>Moderator: {users.filter(u => u.role === 'moderator').length}</li>
              <li>User: {users.filter(u => u.role === 'user').length}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

/*
 * HOẠT ĐỘNG 2: RBAC - USER MANAGEMENT
 * 
 * Chức năng:
 * 1. Hiển thị danh sách tất cả users
 * 2. Xem thông tin: Avatar, Name, Email, Role
 * 3. Thay đổi role: User ↔ Moderator ↔ Admin
 * 4. Xóa user
 * 5. Thống kê: Tổng users, số lượng theo role
 * 
 * RBAC:
 * - CHỈ Admin mới vào được trang này
 * - Được protect bởi ProtectedRoute với allowedRoles={['admin']}
 * 
 * Backend API cần:
 * - GET /api/users - Lấy danh sách users
 * - PUT /api/users/:id/role - Thay đổi role
 * - DELETE /api/users/:id - Xóa user
 */