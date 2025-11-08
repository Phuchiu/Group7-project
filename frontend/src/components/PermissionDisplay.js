import React, { useState } from 'react';
import { useRole } from '../contexts/RoleContext';
import api from '../services/api';

const PermissionDisplay = () => {
  const { permissions } = useRole();
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const testEndpoints = async () => {
    setTesting(true);
    setTestResults([]);
    
    const tests = [
      { name: 'Admin Only', url: '/api/rbac/admin-only', expectedRoles: ['admin'] },
      { name: 'Moderator + Admin', url: '/api/rbac/moderator-admin', expectedRoles: ['admin', 'moderator'] },
      { name: 'All Roles', url: '/api/rbac/all-roles', expectedRoles: ['admin', 'moderator', 'user'] },
      { name: 'Get Users', url: '/api/users', expectedRoles: ['admin', 'moderator'] },
      { name: 'Role Stats', url: '/api/rbac/stats', expectedRoles: ['admin'] }
    ];

    for (const test of tests) {
      try {
        const response = await api.get(test.url);
        setTestResults(prev => [...prev, {
          name: test.name,
          success: true,
          message: response.data.message || 'Success',
          status: response.status
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          success: false,
          message: error.response?.data?.message || 'Failed',
          status: error.response?.status || 'Error'
        }]);
      }
    }
    
    setTesting(false);
  };

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user') || '{}');
  };

  const user = getCurrentUser();

  return (
    <div className="permission-display">
      <h3>🔐 Your Permissions & Role Info</h3>
      
      <div className="user-info">
        <div className="user-card">
          <h4>👤 Current User</h4>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> <span className={`role-badge ${user.role}`}>{user.role}</span></p>
        </div>
      </div>

      <div className="permissions-list">
        <h4>✅ Your Permissions</h4>
        <div className="permissions-grid">
          {permissions.map(permission => (
            <div key={permission} className="permission-item">
              <span className="permission-icon">🔹</span>
              <span className="permission-text">{permission.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="role-tests">
        <h4>🧪 Test API Access</h4>
        <button 
          onClick={testEndpoints} 
          disabled={testing}
          className="test-btn"
        >
          {testing ? 'Testing...' : 'Test My Access'}
        </button>
        
        {testResults.length > 0 && (
          <div className="test-results">
            {testResults.map((result, index) => (
              <div key={index} className={`test-result ${result.success ? 'success' : 'failed'}`}>
                <span className="test-name">{result.name}</span>
                <span className="test-status">{result.status}</span>
                <span className="test-message">{result.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionDisplay;