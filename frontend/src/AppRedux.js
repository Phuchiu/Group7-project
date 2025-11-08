import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import { verifyToken } from './store/authSlice';
import LoginRedux from './components/LoginRedux';
import ProfileRedux from './components/ProfileRedux';
import AdminRedux from './components/AdminRedux';
import ProtectedRoute from './components/ProtectedRoute';
import './styles.css';

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>User Management - Redux</h1>
          {isAuthenticated && (
            <div className="nav-info">
              Xin chào, <strong>{user?.name}</strong> ({user?.role})
            </div>
          )}
        </nav>

        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/profile" /> : <LoginRedux />
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfileRedux />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminRedux />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/unauthorized" 
              element={
                <div className="error-page">
                  <h2>Không có quyền truy cập</h2>
                  <p>Bạn không có quyền truy cập trang này.</p>
                </div>
              } 
            />
            
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const AppRedux = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default AppRedux;