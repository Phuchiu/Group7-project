import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import { verifyToken } from './store/authSlice';
import LoginRedux from './components/LoginRedux';
import SignupRedux from './components/SignupRedux';
import ForgotPassword from './components/ForgotPassword';
import ProfileRedux from './components/ProfileRedux';
import AdminRedux from './components/AdminRedux';
import DashboardRedux from './components/DashboardRedux';
import UsersRedux from './components/UsersRedux';
import SettingsRedux from './components/SettingsRedux';
import NavigationRedux from './components/NavigationRedux';
import ActivityLogs from './components/ActivityLogs';
import RoleManagement from './components/RoleManagement';
import ProtectedRoute from './components/ProtectedRoute';
import AuthDebug from './components/AuthDebug';
import './styles.css';

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Router>
      <div className="app">
        <AuthDebug />
        {isAuthenticated && <NavigationRedux />}

        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LoginRedux />
              } 
            />
            
            <Route 
              path="/signup" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <SignupRedux />
              } 
            />
            
            <Route 
              path="/forgot-password" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : 
                <ForgotPassword onBack={() => window.history.back()} />
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRedux />
                </ProtectedRoute>
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
              path="/users" 
              element={
                <ProtectedRoute>
                  <UsersRedux />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/roles" 
              element={
                <ProtectedRoute requiredRoles={["admin", "moderator"]}>
                  <RoleManagement />
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
              path="/logs" 
              element={
                <ProtectedRoute requiredRoles={["admin", "moderator"]}>
                  <ActivityLogs />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsRedux />
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
                      onClick={handleGoBack}
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
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
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