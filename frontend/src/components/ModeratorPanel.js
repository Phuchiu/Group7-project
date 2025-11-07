import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ModeratorPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data.users);
    } catch (error) {
      setError('Không thể tải danh sách users');
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const response = await api.get(`/api/rbac/users/${userId}/details`);
      setSelectedUser(response.data.user);
    } catch (error) {
      setError('Không thể xem chi tiết user');
    }
  };

  const updateUserProfile = async (userId, userData) => {
    try {
      setError('');
      setSuccess('');
      
      await api.put(`/api/rbac/users/${userId}/profile`, userData);
      
      setSuccess('Cập nhật thông tin user thành công');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Không thể cập nhật user');
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email')
    };
    updateUserProfile(editingUser._id, userData);
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="moderator-panel">
      <h2>🛡️ Moderator Panel</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="moderator-info">
        <p>🔹 Bạn có quyền xem và chỉnh sửa thông tin cơ bản của users</p>
        <p>🔹 Không thể thay đổi role hoặc xóa users</p>
      </div>

      {/* Users List */}
      <div className="users-table">
        <h3>👥 Danh sách Users</h3>
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Role</th>
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
                    onClick={() => viewUserDetails(user._id)}
                    className="view-btn"
                  >
                    Xem
                  </button>
                  {user.role === 'user' && (
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="edit-btn"
                    >
                      Sửa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>👤 Chi tiết User</h3>
            <div className="user-details">
              <p><strong>Tên:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Ngày tạo:</strong> {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}</p>
            </div>
            <button onClick={() => setSelectedUser(null)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>✏️ Chỉnh sửa User</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Tên:</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingUser.name}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={editingUser.email}
                  required 
                />
              </div>
              <div className="modal-actions">
                <button type="submit">Cập nhật</button>
                <button type="button" onClick={() => setEditingUser(null)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorPanel;