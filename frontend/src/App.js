import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import UserList from './components/UserList';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setCurrentView('userlist');
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentView('userlist');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="app">
        <div className="auth-container">
          {currentView === 'login' ? (
            <Login 
              onLogin={handleLogin}
              onSwitchToSignup={() => setCurrentView('signup')}
            />
          ) : (
            <Signup 
              onSignup={handleLogin}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>User Management System</h1>
        <div className="nav-links">
          <button onClick={() => setCurrentView('userlist')}>Users</button>
          <button onClick={() => setCurrentView('profile')}>Profile</button>
          {user.role === 'admin' && (
            <button onClick={() => setCurrentView('admin')}>Admin Panel</button>
          )}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'userlist' && <UserList />}
        {currentView === 'profile' && <Profile user={user} setUser={setUser} />}
        {currentView === 'admin' && user.role === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

export default App;