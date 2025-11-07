import React from 'react';
import { useRole } from '../contexts/RoleContext';

const RoleBasedNav = ({ currentView, setCurrentView, onLogout }) => {
  const { hasRole, hasAnyRole } = useRole();

  return (
    <div className="nav-links">
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