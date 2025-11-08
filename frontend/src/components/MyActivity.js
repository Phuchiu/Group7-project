import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const MyActivity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchMyLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/activity/my-logs?page=${page}&limit=10`);
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (error) {
      setError('Không thể tải activity logs của bạn');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMyLogs();
  }, [fetchMyLogs]);

  const getActionIcon = (action) => {
    const icons = {
      'LOGIN_SUCCESS': '🔓',
      'LOGOUT': '🔒',
      'SIGNUP': '📝',
      'PROFILE_UPDATE': '✏️',
      'AVATAR_UPLOAD': '📸',
      'AVATAR_DELETE': '🗑️',
      'PASSWORD_RESET_REQUEST': '🔑',
      'PASSWORD_RESET_SUCCESS': '✅'
    };
    return icons[action] || '📋';
  };

  const getActionDescription = (action) => {
    const descriptions = {
      'LOGIN_SUCCESS': 'Đăng nhập thành công',
      'LOGOUT': 'Đăng xuất',
      'SIGNUP': 'Đăng ký tài khoản',
      'PROFILE_UPDATE': 'Cập nhật thông tin',
      'AVATAR_UPLOAD': 'Upload avatar',
      'AVATAR_DELETE': 'Xóa avatar',
      'PASSWORD_RESET_REQUEST': 'Yêu cầu reset mật khẩu',
      'PASSWORD_RESET_SUCCESS': 'Reset mật khẩu thành công'
    };
    return descriptions[action] || action.replace(/_/g, ' ');
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
    
    return date.toLocaleDateString('vi-VN');
  };

  if (loading && logs.length === 0) {
    return <div className="loading">Đang tải hoạt động của bạn...</div>;
  }

  return (
    <div className="my-activity">
      <h3>📋 Hoạt động của tôi</h3>
      
      {error && <div className="error">{error}</div>}

      <div className="activity-info">
        <p>Đây là lịch sử hoạt động của tài khoản bạn. Chúng tôi lưu trữ thông tin này để bảo mật tài khoản.</p>
      </div>

      {logs.length === 0 ? (
        <div className="no-activity">
          <p>Chưa có hoạt động nào được ghi lại.</p>
        </div>
      ) : (
        <>
          <div className="activity-list">
            {logs.map(log => (
              <div key={log._id} className="activity-item">
                <div className="activity-icon">
                  {getActionIcon(log.action)}
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    {getActionDescription(log.action)}
                  </div>
                  {log.details && (
                    <div className="activity-details">
                      {typeof log.details === 'object' && log.details !== null 
                        ? JSON.stringify(log.details) 
                        : log.details
                      }
                    </div>
                  )}
                  <div className="activity-time">
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Trước
              </button>
              
              <span className="page-info">
                Trang {pagination.page} / {pagination.pages}
              </span>
              
              <button 
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyActivity;