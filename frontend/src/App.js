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
import { RoleProvider } from './contexts/RoleContext';
import { TokenManager } from './services/api';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [authView, setAuthView] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();
    const userData = localStorage.getItem('user');
    
    if (accessToken && refreshToken && userData) {
      setUser(JSON.parse(userData));
      setCurrentView('userlist');
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, accessToken) => {
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
          {currentView === 'userlist' && <UserList />}
          {currentView === 'profile' && (
            <>
              <Profile user={user} setUser={setUser} />
              <MyActivity />
              <PermissionDisplay />
            </>
          )}
          {currentView === 'admin' && <AdminPanel />}
          {currentView === 'roles' && <RoleManagement />}
          {currentView === 'moderate' && <ModeratorPanel />}
          {currentView === 'logs' && <ActivityLogs />}
          {currentView === 'ratetest' && <RateLimitDemo />}
        </main>
      </div>
    </RoleProvider>
  );
}

export default App;