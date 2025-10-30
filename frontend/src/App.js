import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  if (user) {
    return <Profile user={user} onLogout={handleLogout} />;
  }

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>User Management System</h1>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setCurrentView('login')}
            style={{ 
              padding: '10px 20px', 
              marginRight: '10px',
              backgroundColor: currentView === 'login' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none'
            }}
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => setCurrentView('signup')}
            style={{ 
              padding: '10px 20px',
              backgroundColor: currentView === 'signup' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none'
            }}
          >
            Đăng ký
          </button>
        </div>
      </div>
      
      {currentView === 'login' ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Signup onSignup={handleSignup} />
      )}
    </div>
  );
}

export default App;
