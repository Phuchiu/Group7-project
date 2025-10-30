import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from './UserCard';

const AdminPanel = ({ onBack, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Không thể tải danh sách users'));
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/users/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Không thể tải thống kê:', error);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa user "${userName}"?`)) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('✅ ' + response.data.message);
      fetchUsers();
      fetchStats();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Xóa user thất bại'));
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="admin-container">
      <div className="admin-header">
        <button onClick={onBack} className="btn btn-secondary">
          ← Trang chủ
        </button>
        <div className="admin-title">
          <h1>🔐 Quản lý người dùng</h1>
          <p>Quản lý và giám sát tất cả người dùng trong hệ thống</p>
        </div>
        <button onClick={onLogout} className="btn btn-danger">
          🚀 Đăng xuất
        </button>
      </div>

      {stats && (
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">👥 Tổng users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.adminCount}</div>
            <div className="stat-label">🔑 Admins</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.userCount}</div>
            <div className="stat-label">👤 Users</div>
          </div>
        </div>
      )}

      <div className="users-section">
        <div className="section-header">
          <div className="section-title">
            <h2>📋 Danh sách người dùng</h2>
            <span className="user-count">{users.length} người dùng</span>
          </div>
          <div className="section-actions">
            <button onClick={fetchUsers} className="btn btn-refresh" disabled={loading}>
              {loading ? '⏳ Đang tải...' : '🔄 Làm mới'}
            </button>
          </div>
        </div>

        {loading && users.length === 0 ? (
          <div className="loading">⏳ Đang tải danh sách...</div>
        ) : (
          <div className="users-list">
            {users.map(user => (
              <UserCard 
                key={user._id}
                user={user}
                onDelete={handleDeleteUser}
                loading={loading}
              />
            ))}
          </div>
        )}

        {users.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Chưa có người dùng</h3>
            <p>Hệ thống chưa có người dùng nào đăng ký</p>
          </div>
        )}
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;