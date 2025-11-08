import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import './AdminLogs.css';

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data.logs || []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch logs error:', error);
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    const colors = {
      LOGIN: '#4CAF50',
      LOGOUT: '#9E9E9E',
      REGISTER: '#2196F3',
      UPDATE_PROFILE: '#FF9800',
      CHANGE_PASSWORD: '#F44336',
      UPLOAD_AVATAR: '#9C27B0',
      DELETE_USER: '#F44336',
      UPDATE_ROLE: '#FF5722'
    };
    return colors[action] || '#757575';
  };

  const getActionIcon = (action) => {
    const icons = {
      LOGIN: '🔓',
      LOGOUT: '🔒',
      REGISTER: '📝',
      UPDATE_PROFILE: '✏️',
      CHANGE_PASSWORD: '🔑',
      UPLOAD_AVATAR: '📷',
      DELETE_USER: '🗑️',
      UPDATE_ROLE: '👑'
    };
    return icons[action] || '📋';
  };

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.action === filter);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-logs-container">
      <div className="logs-header">
        <h2>📊 Activity Logs</h2>
        <button onClick={() => navigate('/admin')} className="btn-back">
          ← Quay lại Admin
        </button>
      </div>

      <div className="logs-filter">
        <label>Lọc theo hành động:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">Tất cả</option>
          <option value="LOGIN">Đăng nhập</option>
          <option value="REGISTER">Đăng ký</option>
          <option value="UPDATE_PROFILE">Cập nhật profile</option>
          <option value="CHANGE_PASSWORD">Đổi mật khẩu</option>
          <option value="UPLOAD_AVATAR">Upload avatar</option>
          <option value="DELETE_USER">Xóa user</option>
          <option value="UPDATE_ROLE">Đổi quyền</option>
        </select>
      </div>

      <div className="logs-stats">
        <div className="stat-card">
          <h3>Tổng logs</h3>
          <p>{logs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Đăng nhập</h3>
          <p>{logs.filter(l => l.action === 'LOGIN').length}</p>
        </div>
        <div className="stat-card">
          <h3>Đăng ký</h3>
          <p>{logs.filter(l => l.action === 'REGISTER').length}</p>
        </div>
        <div className="stat-card">
          <h3>Cập nhật</h3>
          <p>{logs.filter(l => l.action === 'UPDATE_PROFILE').length}</p>
        </div>
      </div>

      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Thời gian</th>
              <th>User</th>
              <th>Hành động</th>
              <th>Mô tả</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={log._id}>
                <td>{index + 1}</td>
                <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                <td>{log.user?.name || 'Unknown'}</td>
                <td>
                  <span 
                    className="action-badge"
                    style={{ background: getActionColor(log.action) }}
                  >
                    {getActionIcon(log.action)} {log.action}
                  </span>
                </td>
                <td>{log.description}</td>
                <td>{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminLogs;
