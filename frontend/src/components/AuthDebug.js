import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { verifyToken } from '../store/authSlice';

const AuthDebug = () => {
  const { user, isAuthenticated, isLoading, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('AuthDebug - State:', { user, isAuthenticated, isLoading, token: !!token });
  }, [user, isAuthenticated, isLoading, token]);

  const handleVerifyToken = () => {
    dispatch(verifyToken());
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '350px',
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4ade80' }}>🔍 Auth Debug</h4>
      <div><strong>Authenticated:</strong> {isAuthenticated ? '✅' : '❌'}</div>
      <div><strong>Loading:</strong> {isLoading ? '⏳' : '✅'}</div>
      <div><strong>Token:</strong> {token ? '✅ Present' : '❌ None'}</div>
      <div><strong>User:</strong> {user ? '✅ Loaded' : '❌ Null'}</div>
      {user && (
        <>
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Role:</strong> <span style={{color: '#fbbf24'}}>{user.role}</span></div>
        </>
      )}
      <button 
        onClick={handleVerifyToken}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        Verify Token
      </button>
    </div>
  );
};

export default AuthDebug;