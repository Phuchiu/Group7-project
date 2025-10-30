import React from 'react';

const UserCard = ({ user, onDelete, loading }) => {
  const getRoleIcon = (role) => {
    return role === 'admin' ? '🔑' : '👤';
  };

  const getRoleName = (role) => {
    return role === 'admin' ? 'Quản trị viên' : 'Người dùng';
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa user "${user.name}"?`)) {
      onDelete(user._id, user.name);
    }
  };

  return (
    <div className="user-card">
      <div className="user-avatar">
        {user.avatar ? (
          <img src={user.avatar} alt="Avatar" />
        ) : (
          <div className="avatar-placeholder">{getRoleIcon(user.role)}</div>
        )}
        <div className={`role-badge ${user.role}`}>
          {getRoleIcon(user.role)}
        </div>
      </div>
      
      <div className="user-details">
        <div className="user-main">
          <h3 className="user-name">{user.name}</h3>
          <span className={`role-tag ${user.role}`}>{getRoleName(user.role)}</span>
        </div>
        <div className="user-contact">
          <div className="user-email">
            📧 {user.email}
          </div>
          <div className="user-date">
            📅 Tham gia {new Date(user.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
      
      <div className="user-actions">
        <button 
          onClick={handleDelete}
          className="btn-delete"
          disabled={loading}
          title="Xóa người dùng"
        >
          {loading ? '⏳' : '🗑️'}
        </button>
      </div>
    </div>
  );
};

export default UserCard;