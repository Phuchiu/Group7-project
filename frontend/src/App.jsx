// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import components
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserList from './pages/UserList';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  console.log('🎨 App rendered:', { 
    isAuthenticated, 
    userRole: user?.role 
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/profile" replace /> : <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/profile" replace /> : <Register />
            } 
          />

          {/* Protected Routes - Tất cả roles */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserList />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/profile" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;