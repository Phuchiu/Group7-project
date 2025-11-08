import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

const UsersRedux = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching users...');
      const response = await api.get('/api/users');
      console.log('Users response:', response.data);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'Không thể tải danh sách users';
      setError(`Lỗi: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/api/users/${editingUser._id}`, formData);
      } else {
        await api.post('/api/users', formData);
      }
      setFormData({ name: '', email: '' });
      setShowAddForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData({ name: userToEdit.name, email: userToEdit.email });
    setShowAddForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;
    
    try {
      await api.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      setError('Không thể xóa user');
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'moderator';
  const canDelete = user?.role === 'admin';
  const canAdd = user?.role === 'admin';

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="users-container">
      <div className="users-panel">
        <div className="users-header">
          <h2>👥 Quản lý Users</h2>
          {canAdd && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="add-btn"
            >
              {showAddForm ? '❌ Hủy' : '➕ Thêm User'}
            </button>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="add-user-form">
            <h3>{editingUser ? '✏️ Chỉnh sửa User' : '➕ Thêm User Mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Tên"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <button type="submit" className="submit-btn">
                  {editingUser ? '💾 Cập nhật' : '➕ Thêm'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="users-table">
          <div className="table-header">
            <h3>📋 Danh sách Users ({users.length})</h3>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                {(canEdit || canDelete) && <th>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="avatar-display avatar-small">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="avatar-img" />
                      ) : (
                        <div className="avatar-fallback">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="user-name">{u.name}</td>
                  <td className="user-email">{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td className="created-date">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="actions">
                      {canEdit && (
                        <button 
                          onClick={() => handleEdit(u)}
                          className="edit-btn"
                        >
                          ✏️ Sửa
                        </button>
                      )}
                      {canDelete && u._id !== user.id && (
                        <button 
                          onClick={() => handleDelete(u._id)}
                          className="delete-btn"
                        >
                          🗑️ Xóa
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersRedux;