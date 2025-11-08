import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ForgotPasswordDemo from './components/ForgotPasswordDemo';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import UserList from './components/UserList';
import TokenStatus from './components/TokenStatus';
import RoleBasedNav from './components/RoleBasedNav';
import RoleManagement from './components/RoleManagement';
import ModeratorPanel from './components/ModeratorPanel';
import PermissionDisplay from './components/PermissionDisplay';
import ActivityLogs from './components/ActivityLogs';
import RateLimitDemo from './components/RateLimitDemo';
import MyActivity from './components/MyActivity';
import { RoleProvider, useRole } from './contexts/RoleContext';
import { TokenManager } from './services/api';
import './styles.css';

// Protected content component
const MainContent = ({ currentView, user, setUser }) => {
  const { hasRole, hasAnyRole } = useRole();

  // Access denied component
  const AccessDenied = () => (
    <div className="access-denied">
      <h2>🚫 Không có quyền</h2>
      <p>Bạn không có quyền truy cập trang này.</p>
    </div>
  );

  switch (currentView) {
    case 'userlist':
      return <UserList />;
    
    case 'profile':
      return (
        <>
          <Profile user={user} setUser={setUser} />
          <MyActivity />
          <PermissionDisplay />
        </>
      );
    
    case 'admin':
      return hasAnyRole(['admin', 'moderator']) ? <AdminPanel /> : <AccessDenied />;
    
    case 'roles':
      return hasRole('admin') ? <RoleManagement /> : <AccessDenied />;
    
    case 'moderate':
      return hasRole('moderator') ? <ModeratorPanel /> : <AccessDenied />;
    
    case 'logs':
      return hasRole('admin') ? <ActivityLogs /> : <AccessDenied />;
    
    case 'ratetest':
      return hasRole('admin') ? <RateLimitDemo /> : <AccessDenied />;
    
    default:
      return <UserList />;
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [authView, setAuthView] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();
    const userData = localStorage.getItem('user');
    
    console.log('App useEffect - userData:', userData); // Debug log
    
    if (accessToken && refreshToken && userData) {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user:', parsedUser); // Debug log
      setUser(parsedUser);
      setCurrentView('userlist');
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, accessToken) => {
    console.log('Login userData:', userData); // Debug log
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentView('userlist');
  };

  const handleLogout = async () => {
    try {
      // Call logout API to revoke refresh token
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        await fetch('http://localhost:3000/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      setUser(null);
      setCurrentView('login');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return (
      <Router>
        <div className="app">
          <Routes>
            <Route path="/demo" element={<ForgotPasswordDemo />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={
              <div className="auth-container">
                {authView === 'login' && (
                  <Login 
                    onLogin={handleLogin}
                    onSwitchToSignup={() => setAuthView('signup')}
                    onForgotPassword={() => setAuthView('forgot')}
                  />
                )}
                {authView === 'signup' && (
                  <Signup 
                    onSignup={handleLogin}
                    onSwitchToLogin={() => setAuthView('login')}
                  />
                )}
                {authView === 'forgot' && (
                  <ForgotPassword 
                    onBack={() => setAuthView('login')}
                  />
                )}
              </div>
            } />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <RoleProvider>
      <div className="app">
        {user && <TokenStatus />}
        <nav className="navbar">
          <h1>User Management System</h1>
          <RoleBasedNav 
            currentView={currentView}
            setCurrentView={setCurrentView}
            onLogout={handleLogout}
            user={user}
          />
        </nav>

        <main className="main-content">
          <MainContent 
            currentView={currentView} 
            user={user} 
            setUser={setUser}
          />
        </main>
      </div>
    </RoleProvider>
  );
}

export default App;