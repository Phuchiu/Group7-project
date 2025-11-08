import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DashboardRedux = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    userCount: 0,
    moderatorCount: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('🔍 Fetching dashboard data...');
      // Fetch user stats
      const statsResponse = await api.get('/api/users/stats');
      console.log('📊 Stats response:', statsResponse.data);
      setStats(statsResponse.data);

      // Fetch recent activity if admin
      if (user?.role === 'admin') {
        console.log('📋 Fetching activity logs...');
        const activityResponse = await api.get('/api/activity/logs?limit=5');
        console.log('📋 Activity response:', activityResponse.data);
        setRecentActivity(activityResponse.data.logs || []);
      }
    } catch (error) {
      console.error('❌ Dashboard error:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <div className="loading">Đang tải dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h2>📊 Dashboard</h2>
        <p>Chào mừng, <strong>{user?.name}</strong>!</p>
        
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate('/users')}>
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Tổng Users</h3>
              <div className="stat-number">{stats.totalUsers}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👑</div>
            <div className="stat-info">
              <h3>Admins</h3>
              <div className="stat-number">{stats.adminCount}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🛡️</div>
            <div className="stat-info">
              <h3>Moderators</h3>
              <div className="stat-number">{stats.moderatorCount}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>Users</h3>
              <div className="stat-number">{stats.userCount}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="action-grid">
            <button onClick={() => navigate('/profile')} className="action-btn">
              <span>👤</span>
              <div>
                <h4>View Profile</h4>
                <p>Xem và chỉnh sửa profile</p>
              </div>
            </button>
            
            <button onClick={() => navigate('/users')} className="action-btn">
              <span>👥</span>
              <div>
                <h4>Manage Users</h4>
                <p>Quản lý danh sách users</p>
              </div>
            </button>
            
            {user?.role === 'admin' && (
              <>
                <button onClick={() => navigate('/admin')} className="action-btn">
                  <span>⚙️</span>
                  <div>
                    <h4>Admin Panel</h4>
                    <p>Quản trị hệ thống</p>
                  </div>
                </button>
                
                <button onClick={() => navigate('/logs')} className="action-btn">
                  <span>📋</span>
                  <div>
                    <h4>Activity Logs</h4>
                    <p>Xem logs hoạt động</p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {user?.role === 'admin' && recentActivity.length > 0 && (
          <div className="recent-activity">
            <h3>📈 Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.action === 'LOGIN_SUCCESS' ? '🔓' : 
                     activity.action === 'LOGOUT' ? '🔒' : 
                     activity.action === 'SIGNUP' ? '👤' : '📝'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.action}</div>
                    <div className="activity-details">{activity.details}</div>
                    <div className="activity-time">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/logs')} className="view-all-btn">
              Xem tất cả logs →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardRedux;