// src/components/Moderator/ModeratorPanel.jsx
// Hoạt động 2: RBAC - Moderator Panel (Admin + Moderator only)

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import tokenService from '../../utils/tokenService';
import './Moderator.css';

const ModeratorPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = tokenService.getUser();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      console.log('📥 Fetching reports...');
      // Giả sử có API lấy reports
      const response = await axiosInstance.get('/reports');
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('❌ Fetch reports error:', error);
      // Demo data nếu không có API
      setReports([
        {
          _id: '1',
          type: 'spam',
          content: 'User reported for spam',
          reporter: 'user1@email.com',
          status: 'pending',
          createdAt: new Date(),
        },
        {
          _id: '2',
          type: 'abuse',
          content: 'Abusive language detected',
          reporter: 'user2@email.com',
          status: 'pending',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      console.log(`🔄 ${action} report ${reportId}`);
      await axiosInstance.put(`/reports/${reportId}`, { status: action });
      
      // Update local state
      setReports(reports.map(report =>
        report._id === reportId ? { ...report, status: action } : report
      ));
      
      alert(`Report ${action} thành công`);
    } catch (error) {
      console.error('❌ Report action error:', error);
      // Demo: Update local anyway
      setReports(reports.map(report =>
        report._id === reportId ? { ...report, status: action } : report
      ));
      alert(`Report ${action} (Demo mode)`);
    }
  };

  if (loading) {
    return (
      <div className="moderator-container">
        <div className="loading">⏳ Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="moderator-container">
      <div className="moderator-header">
        <h2>🛡️ Moderator Panel</h2>
        <div className="moderator-info">
          <span>Logged in as:</span>
          <span className={`role-badge role-${user?.role}`}>
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="moderator-description">
        <p>
          ℹ️ Trang này chỉ dành cho <strong>Admin</strong> và <strong>Moderator</strong>.
          Moderator có thể xử lý reports, quản lý content, nhưng không thể quản lý users.
        </p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{reports.length}</div>
            <div className="stat-label">Total Reports</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">
              {reports.filter(r => r.status === 'pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">
              {reports.filter(r => r.status === 'rejected').length}
            </div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      <div className="reports-section">
        <h3>📋 Reports Queue</h3>
        {reports.length === 0 ? (
          <div className="no-reports">
            <p>🎉 Không có reports nào!</p>
          </div>
        ) : (
          <div className="reports-list">
            {reports.map((report) => (
              <div key={report._id} className={`report-card status-${report.status}`}>
                <div className="report-header">
                  <span className={`report-type type-${report.type}`}>
                    {report.type?.toUpperCase()}
                  </span>
                  <span className="report-date">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="report-content">
                  <p>{report.content}</p>
                  <small>Reported by: {report.reporter}</small>
                </div>
                <div className="report-actions">
                  {report.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleReportAction(report._id, 'resolved')}
                        className="btn-resolve"
                      >
                        ✅ Resolve
                      </button>
                      <button
                        onClick={() => handleReportAction(report._id, 'rejected')}
                        className="btn-reject"
                      >
                        ❌ Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-badge status-${report.status}`}>
                      {report.status?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RBAC Demo */}
      <div className="rbac-demo">
        <h3>🔐 RBAC Demo - Hoạt động 2</h3>
        <div className="role-comparison">
          <div className="role-column">
            <h4>👤 USER</h4>
            <ul>
              <li>✅ Profile</li>
              <li>❌ Moderator Panel</li>
              <li>❌ User Management</li>
              <li>❌ Admin Dashboard</li>
            </ul>
          </div>
          <div className="role-column">
            <h4>🛡️ MODERATOR</h4>
            <ul>
              <li>✅ Profile</li>
              <li>✅ Moderator Panel</li>
              <li>❌ User Management</li>
              <li>❌ Admin Dashboard</li>
            </ul>
          </div>
          <div className="role-column">
            <h4>⚙️ ADMIN</h4>
            <ul>
              <li>✅ Profile</li>
              <li>✅ Moderator Panel</li>
              <li>✅ User Management</li>
              <li>✅ Admin Dashboard</li>
            </ul>
          </div>
        </div>
        <div className="current-access">
          <p>
            Your role (<strong>{user?.role}</strong>) has access to:
          </p>
          <ul>
            <li>✅ This page (Moderator Panel)</li>
            {user?.role === 'admin' && (
              <>
                <li>✅ User Management</li>
                <li>✅ Admin Dashboard</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModeratorPanel;

/*
 * HOẠT ĐỘNG 2: MODERATOR PANEL
 * 
 * Chức năng:
 * 1. Xem reports/complaints
 * 2. Resolve hoặc reject reports
 * 3. Thống kê reports
 * 
 * RBAC:
 * - Admin VÀ Moderator đều vào được
 * - Protected bởi: allowedRoles={['admin', 'moderator']}
 * 
 * So sánh quyền:
 * USER: Chỉ thấy Profile
 * MODERATOR: Profile + Moderator Panel
 * ADMIN: Profile + Moderator Panel + User Management + Admin Dashboard
 */