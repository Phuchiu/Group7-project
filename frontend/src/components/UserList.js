import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data.users);
    } catch (error) {
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/users', newUser);
      setNewUser({ name: '', email: '' });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Không thể thêm người dùng');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/users/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Không thể cập nhật người dùng');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) {
        setError(error.response?.data?.message || 'Không thể xóa người dùng');
      }
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="user-list">
      <h2>Danh Sách Người Dùng</h2>
      
      {error && <div className="error">{error}</div>}

      {/* Add User Form */}
      <div className="add-user-form">
        <h3>Thêm Người Dùng Mới</h3>
        <form onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Họ tên"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            required
          />
          <button type="submit">Thêm</button>
        </form>
      </div>

      {/* Users Table */}
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
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button 
                    onClick={() => setEditingUser(user)}
                    className="edit-btn"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="delete-btn"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chỉnh Sửa Người Dùng</h3>
            <form onSubmit={handleUpdateUser}>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                required
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                required
              />
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

export default UserList;