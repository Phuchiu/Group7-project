// src/components/Admin/Dashboard.jsx
// Hoạt động 2: RBAC - Admin Dashboard (Admin only)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import tokenService from '../../utils/tokenService';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalModerators: 0,
    totalRegularUsers: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const user = tokenService.getUser();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('📊 Fetching dashboard data...');
      
      // Fetch users
      const usersResponse = await axiosInstance.get('/users');
      const users = usersResponse.data.users || usersResponse.data;

      // Calculate stats
      const totalUsers = users.length;
      const totalAdmins = users.filter(u => u.role === 'admin').length;
      const totalModerators = users.filter(u => u.role === 'moderator').length;
      const totalRegularUsers = users.filter(u => u.role === 'user').length;

      setStats({
        totalUsers,
        totalAdmins,
        totalModerators,
        totalRegularUsers,
        recentActivity: [
          { action: 'User login', user: 'john@email.com', time: '2 minutes ago' },
          { action: 'New user registered', user: 'jane@email.com', time: '5 minutes ago' },
          { action: 'Role changed', user: 'mike@email.com', time: '10 minutes ago' },
        ],
      });

    } catch (error) {
      console.error('❌ Fetch dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">⏳ Đang tải dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>⚙️ Admin Dashboard</h1>
        <div className="admin-info">
          <span>Welcome, {user?.name}</span>
          <span className="role-badge role-admin">ADMIN</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats">
        <div className="stat-card stat-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalAdmins}</div>
            <div className="stat-label">Admins</div>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">🛡️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalModerators}</div>
            <div className="stat-label">Moderators</div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalRegularUsers}</div>
            <div className="stat-label">Regular Users</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>⚡ Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/admin/users" className="action-card">
            <div className="action-icon">👥</div>
            <div className="action-content">
              <h4>Manage Users</h4>
              <p>View, edit, and delete users</p>
            </div>
          </Link>

          <Link to="/admin/logs" className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-content">
              <h4>Activity Logs</h4>
              <p>Monitor user activities</p>
            </div>
          </Link>

          <Link to="/moderator" className="action-card">
            <div className="action-icon">🛡️</div>
            <div className="action-content">
              <h4>Moderator Panel</h4>
              <p>Handle reports and moderation</p>
            </div>
          </Link>

          <Link to="/profile" className="action-card">
            <div className="action-icon">⚙️</div>
            <div className="action-content">
              <h4>Settings</h4>
              <p>Update your profile</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>📋 Recent Activity</h3>
        <div className="activity-list">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">🔔</div>
              <div className="activity-content">
                <div className="activity-action">{activity.action}</div>
                <div className="activity-details">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Info */}
      <div className="rbac-info-panel">
        <h3>🔐 Role-Based Access Control (RBAC)</h3>
        <div className="rbac-table">
          <table>
            <thead>
              <tr>
                <th>Page/Feature</th>
                <th>User</th>
                <th>Moderator</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Profile</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Moderator Panel</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>User Management</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Admin Dashboard</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Activity Logs</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

/*
 * HOẠT ĐỘNG 2: ADMIN DASHBOARD
 * 
 * Chức năng:
 * 1. Overview statistics (tổng users theo role)
 * 2. Quick actions (links đến các trang quản lý)
 * 3. Recent activity logs
 * 4. RBAC table (so sánh quyền các roles)
 * 
 * RBAC:
 * - CHỈ Admin vào được
 * - Protected bởi: allowedRoles={['admin']}
 * 
 * Backend API cần:
 * - GET /api/users - Lấy stats
 * - GET /api/logs (optional) - Recent activity
 */