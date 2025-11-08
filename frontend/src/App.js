// src/App.js - Redux Version
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import components
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Usersdashboard from './pages/Userdashboard';
import Forgotpassword from './pages/Forgotpassword';
import Resetpassword from './pages/Resetpassword';
import Uploadavatar from './pages/Uploadavatar';
import AdminLogs from './pages/AdminLogs';

import './styles/App.css';

// Protected Route Component - Dùng Redux
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');
  
  console.log('🔐 ProtectedRoute check:', {
    isAuthenticated,
    hasToken: !!token,
    timestamp: new Date().toLocaleTimeString()
  });
  
  if (!isAuthenticated && !token) {
    console.log('❌ Not authenticated → Redirect to /login');
    alert('⚠️ BẠN CHƯA ĐĂNG NHẬP!\n\nVui lòng đăng nhập để truy cập trang này.');
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ Authenticated → Allow access');
  return children;
};

// Admin Route Component - Dùng Redux
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');
  
  console.log('👑 AdminRoute check:', {
    isAuthenticated,
    hasToken: !!token,
    userRole: user?.role,
    timestamp: new Date().toLocaleTimeString()
  });
  
  if (!isAuthenticated && !token) {
    console.log('❌ Not authenticated → Redirect to /login');
    alert('⚠️ BẠN CHƯA ĐĂNG NHẬP!\n\nVui lòng đăng nhập để truy cập trang này.');
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    console.log('🚫 Not admin (role: ' + user?.role + ') → Redirect to /profile');
    alert('⚠️ KHÔNG CÓ QUYỀN TRUY CẬP!\n\nChỉ Admin mới có thể truy cập trang này.');
    return <Navigate to="/profile" replace />;
  }
  
  console.log('✅ Admin authenticated → Allow access');
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Forgotpassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reset-password" 
            element={
              <ProtectedRoute>
                <Resetpassword />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/upload-avatar" 
            element={
              <ProtectedRoute>
                <Uploadavatar />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Usersdashboard />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/admin/logs" 
            element={
              <AdminRoute>
                <AdminLogs />
              </AdminRoute>
            } 
          />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;