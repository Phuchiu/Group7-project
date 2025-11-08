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
            <div className="nav-user-info">
              <div className="avatar-display avatar-small">
                <div className="avatar-fallback">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div className="nav-username">
                {user?.name} 
                <span className={`role-badge ${user?.role}`}>{user?.role}</span>
              </div>
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
                <div className="auth-container">
                  <div className="auth-form">
                    <h2>🚫 Không có quyền</h2>
                    <div className="error">
                      Bạn không có quyền truy cập trang này.
                    </div>
                    <button 
                      onClick={() => window.history.back()}
                      className="link-btn"
                    >
                      Quay lại
                    </button>
                  </div>
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