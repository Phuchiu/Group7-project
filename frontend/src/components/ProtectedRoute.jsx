// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  console.log('🔐 ProtectedRoute check:', {
    isAuthenticated,
    userRole: user?.role,
    allowedRoles,
  });

  // Kiểm tra đã đăng nhập chưa
  if (!isAuthenticated) {
    console.log('❌ Not authenticated → Redirect to /login');
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role (nếu có yêu cầu)
  if (allowedRoles.length > 0) {
    const userRole = user?.role || 'user';
    
    if (!allowedRoles.includes(userRole)) {
      console.log(`❌ Role ${userRole} not allowed → Redirect to /`);
      return <Navigate to="/" replace />;
    }
  }

  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;