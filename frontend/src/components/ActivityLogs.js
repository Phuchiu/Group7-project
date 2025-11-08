import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    action: '',
    userId: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({});

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await api.get(`/api/activity/logs?${params}`);
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (error) {
      setError('Không thể tải activity logs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/api/activity/stats?days=7');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [fetchLogs, fetchStats]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getActionBadgeClass = (action) => {
    const classes = {
      'LOGIN_SUCCESS': 'badge-success',
      'LOGIN_FAILED': 'badge-danger',
      'LOGOUT': 'badge-info',
      'SIGNUP': 'badge-primary',
      'PROFILE_UPDATE': 'badge-warning',
      'AVATAR_UPLOAD': 'badge-info',
      'AVATAR_DELETE': 'badge-warning',
      'ROLE_CHANGE': 'badge-danger',
      'USER_DELETE': 'badge-danger',
      'RATE_LIMIT_HIT': 'badge-danger'
    };
    return classes[action] || 'badge-secondary';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  if (loading && logs.length === 0) {
    return <div className="loading">Đang tải activity logs...</div>;
  }

  return (
    <div className="activity-logs">
      <h2>📊 Activity Logs & Statistics</h2>
      
      {error && <div className="error">{error}</div>}

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-section">
          <h3>📈 Thống kê 7 ngày qua</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Failed Logins</h4>
              <div className="stat-number danger">{stats.failedLogins}</div>
            </div>
            <div className="stat-card">
              <h4>Rate Limit Hits</h4>
              <div className="stat-number warning">{stats.rateLimitHits}</div>
            </div>
            <div className="stat-card">
              <h4>Top Actions</h4>
              <div className="stat-list">
                {stats.actionStats.slice(0, 3).map(stat => (
                  <div key={stat._id} className="stat-item">
                    <span>{stat._id}</span>
                    <span>{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <h3>🔍 Filters</h3>
        <div className="filters-grid">
          <select 
            value={filters.action} 
            onChange={(e) => handleFilterChange('action', e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="LOGIN_SUCCESS">Login Success</option>
            <option value="LOGIN_FAILED">Login Failed</option>
            <option value="LOGOUT">Logout</option>
            <option value="SIGNUP">Signup</option>
            <option value="PROFILE_UPDATE">Profile Update</option>
            <option value="AVATAR_UPLOAD">Avatar Upload</option>
            <option value="RATE_LIMIT_HIT">Rate Limit Hit</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            placeholder="End Date"
          />

          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="logs-section">
        <h3>📝 Activity Logs ({pagination.total || 0} total)</h3>
        
        {loading && <div className="loading-overlay">Loading...</div>}
        
        <div className="logs-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td className="timestamp">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="user-info">
                    {log.userId ? (
                      <div>
                        <div className="user-name">{log.userId.name}</div>
                        <div className="user-email">{log.userId.email}</div>
                        <span className={`role-badge ${log.userId.role}`}>
                          {log.userId.role}
                        </span>
                      </div>
                    ) : (
                      <span className="anonymous">Anonymous</span>
                    )}
                  </td>
                  <td>
                    <span className={`action-badge ${getActionBadgeClass(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="details">
                    {typeof log.details === 'object' && log.details !== null 
                      ? JSON.stringify(log.details) 
                      : log.details || '-'
                    }
                  </td>
                  <td className="ip-address">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <button 
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;