import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AdminRedux = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      setError('Không thể tải danh sách users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      setError('Không thể xóa user');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="admin-container">
      <div className="admin-panel">
        <h2>Admin Panel</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tổng Users</h3>
            <div className="stat-number">{users.length}</div>
          </div>
          <div className="stat-card">
            <h3>Admin: {user?.name}</h3>
            <div className="stat-number">👑</div>
          </div>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <div className="users-table">
          <h3>Danh sách Users ({users.length})</h3>
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                  <td>
                    {u._id !== user.id && (
                      <button 
                        onClick={() => deleteUser(u._id)}
                        className="delete-btn"
                      >
                        Xóa
                      </button>
                    )}
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

export default AdminRedux;