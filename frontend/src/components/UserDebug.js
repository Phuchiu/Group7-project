import React from 'react';
import { useSelector } from 'react-redux';

const UserDebug = () => {
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Debug Info:</h4>
      <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
      <p><strong>Token:</strong> {token ? 'Present' : 'None'}</p>
    </div>
  );
};

export default UserDebug;