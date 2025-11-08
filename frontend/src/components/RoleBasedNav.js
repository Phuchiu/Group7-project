import React from 'react';
import { useRole } from '../contexts/RoleContext';
import AvatarDisplay from './AvatarDisplay';

const RoleBasedNav = ({ currentView, setCurrentView, onLogout, user }) => {
  const { hasRole, hasAnyRole } = useRole();

  return (
    <div className="nav-links">
      <div className="nav-user-info">
        <AvatarDisplay 
          avatar={user?.avatar} 
          name={user?.name} 
          size="small" 
        />
        <span className="nav-username">{user?.name}</span>
      </div>
      {/* All users can see Users list */}
      <button 
        onClick={() => setCurrentView('userlist')}
        className={currentView === 'userlist' ? 'active' : ''}
      >
        Users
      </button>

      {/* All users can see their profile */}
      <button 
        onClick={() => setCurrentView('profile')}
        className={currentView === 'profile' ? 'active' : ''}
      >
        Profile
      </button>

      {/* Admin and Moderator can see Admin Panel */}
      {hasAnyRole(['admin', 'moderator']) && (
        <button 
          onClick={() => setCurrentView('admin')}
          className={currentView === 'admin' ? 'active' : ''}
        >
          {hasRole('admin') ? 'Admin Panel' : 'Moderator Panel'}
        </button>
      )}

      {/* Admin only - Role Management */}
      {hasRole('admin') && (
        <button 
          onClick={() => setCurrentView('roles')}
          className={currentView === 'roles' ? 'active' : ''}
        >
          Role Management
        </button>
      )}

      {/* Admin only - Activity Logs */}
      {hasRole('admin') && (
        <button 
          onClick={() => setCurrentView('logs')}
          className={currentView === 'logs' ? 'active' : ''}
        >
          Activity Logs
        </button>
      )}

      {/* Admin only - Rate Limit Test */}
      {hasRole('admin') && (
        <button 
          onClick={() => setCurrentView('ratetest')}
          className={currentView === 'ratetest' ? 'active' : ''}
        >
          Rate Limit Test
        </button>
      )}

      {/* Moderator only - User Management */}
      {hasRole('moderator') && (
        <button 
          onClick={() => setCurrentView('moderate')}
          className={currentView === 'moderate' ? 'active' : ''}
        >
          User Management
        </button>
      )}

      <button onClick={onLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default RoleBasedNav;