// src/components/Admin/UserLogs.jsx
// Hoạt động 5: User Activity Logging - Ghi lại hoạt động người dùng

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './UserLogs.css';

const UserLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    action: 'all',
    userId: '',
    startDate: '',
    endDate: '',
  });
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      console.log('📊 Fetching user logs...');
      setLoading(true);
      
      const response = await axiosInstance.get('/logs', {
        params: filters.action !== 'all' ? { action: filters.action } : {},
      });

      console.log('✅ Logs fetched:', response.data);
      
      const logsData = response.data.logs || response.data || [];
      setLogs(logsData);
      
      // Calculate stats
      calculateStats(logsData);
      
      setError('');
    } catch (error) {
      console.error('❌ Fetch logs error:', error);
      
      // Demo data if API not available
      const demoLogs = generateDemoLogs();
      setLogs(demoLogs);
      calculateStats(demoLogs);
      
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const generateDemoLogs = () => {
    const actions = ['login', 'logout', 'register', 'update_profile', 'change_role', 'upload_avatar'];
    const users = [
      { name: 'John Doe', email: 'john@email.com' },
      { name: 'Jane Smith', email: 'jane@email.com' },
      { name: 'Admin User', email: 'admin@email.com' },
    ];

    return Array.from({ length: 50 }, (_, i) => ({
      _id: `log-${i}`,
      action: actions[Math.floor(Math.random() * actions.length)],
      userId: {
        _id: `user-${i}`,
        name: users[i % users.length].name,
        email: users[i % users.length].email,
      },
      details: `Action performed by user`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }));
  };

  const calculateStats = (logsData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayCount = logsData.filter(
      log => new Date(log.timestamp) >= today
    ).length;

    const weekCount = logsData.filter(
      log => new Date(log.timestamp) >= weekAgo
    ).length;

    setStats({
      total: logsData.length,
      today: todayCount,
      thisWeek: weekCount,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    fetchLogs();
  };

  const clearFilters = () => {
    setFilters({
      action: 'all',
      userId: '',
      startDate: '',
      endDate: '',
    });
    fetchLogs();
  };

  const getActionIcon = (action) => {
    const icons = {
      login: '🔐',
      logout: '🚪',
      register: '📝',
      update_profile: '✏️',
      change_role: '👑',
      upload_avatar: '📸',
      delete_user: '🗑️',
      view_logs: '📊',
    };
    return icons[action] || '📋';
  };

  const getActionColor = (action) => {
    const colors = {
      login: 'action-success',
      logout: 'action-info',
      register: 'action-primary',
      update_profile: 'action-warning',
      change_role: 'action-danger',
      upload_avatar: 'action-info',
      delete_user: 'action-danger',
    };
    return colors[action] || 'action-default';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="logs-container">
        <div className="loading">⏳ Đang tải logs...</div>
      </div>
    );
  }

  return (
    <div className="logs-container">
      <div className="logs-header">
        <h2>📊 User Activity Logs</h2>
        <button onClick={fetchLogs} className="btn-refresh">
          🔄 Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="logs-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Logs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.today}</div>
            <div className="stat-label">Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-content">
            <div className="stat-value">{stats.thisWeek}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="logs-filters">
        <div className="filter-group">
          <label>Action Type:</label>
          <select 
            name="action" 
            value={filters.action} 
            onChange={handleFilterChange}
          >
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="register">Register</option>
            <option value="update_profile">Update Profile</option>
            <option value="change_role">Change Role</option>
            <option value="upload_avatar">Upload Avatar</option>
          </select>
        </div>

        <div className="filter-actions">
          <button onClick={applyFilters} className="btn-apply">
            🔍 Apply Filters
          </button>
          <button onClick={clearFilters} className="btn-clear">
            ✖️ Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Logs Table */}
      <div className="logs-table-container">
        {logs.length === 0 ? (
          <div className="no-logs">
            <p>📭 No logs found</p>
          </div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>User</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="log-time">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td>
                    <span className={`action-badge ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)} {log.action}
                    </span>
                  </td>
                  <td className="log-user">
                    <div className="user-info">
                      <strong>{log.userId?.name || 'Unknown'}</strong>
                      <small>{log.userId?.email || 'N/A'}</small>
                    </div>
                  </td>
                  <td className="log-details">
                    {log.details || '-'}
                  </td>
                  <td className="log-ip">
                    <code>{log.ipAddress || 'N/A'}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-section">
          <h3>🔧 Debug - Hoạt động 5</h3>
          <div className="debug-info">
            <p><strong>Total logs:</strong> {logs.length}</p>
            <p><strong>Filters:</strong> {JSON.stringify(filters)}</p>
            <p><strong>Stats:</strong> {JSON.stringify(stats)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLogs;

/*
 * HOẠT ĐỘNG 5: USER ACTIVITY LOGS
 * 
 * Chức năng:
 * 1. Hiển thị tất cả logs (Admin only)
 * 2. Statistics: Total, Today, This Week
 * 3. Filter theo action type
 * 4. Real-time relative timestamps
 * 5. Color-coded actions
 * 
 * Backend API cần:
 * GET /api/logs
 * - Query params: ?action=login&startDate=...&endDate=...
 * - Response: { logs: [...] }
 * 
 * Log schema example:
 * {
 *   _id: "log123",
 *   action: "login",
 *   userId: { _id, name, email },
 *   details: "User logged in successfully",
 *   ipAddress: "192.168.1.1",
 *   userAgent: "Mozilla/5.0...",
 *   timestamp: "2024-01-15T10:30:00Z"
 * }
 * 
 * Middleware logging (Backend):
 * - Mỗi action quan trọng → Tạo log entry
 * - Login, logout, register, update, delete
 */