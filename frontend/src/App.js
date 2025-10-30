// src/App.js - VERSION TEST
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import từng component một để dễ debug
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Usersdashboard from './pages/Userdashboard';
import Forgotpassword from './pages/Forgotpassword';
import Resetpassword from './pages/Resetpassword';
import Uploadavatar from './pages/Uploadavatar';

import './styles/App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }
  
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
          
          {/* Admin Route */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Usersdashboard />
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