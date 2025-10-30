import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('login');
  };

  if (user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Chào mừng!</h1>
        <p>Bạn đã đăng nhập thành công</p>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>User Management System</h1>
        <div>
          <button 
            onClick={() => setView('login')}
            style={{ 
              padding: '10px 20px', 
              margin: '0 10px',
              backgroundColor: view === 'login' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none'
            }}
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => setView('signup')}
            style={{ 
              padding: '10px 20px',
              backgroundColor: view === 'signup' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none'
            }}
          >
            Đăng ký
          </button>
        </div>
      </div>
      
      {view === 'login' ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Signup onSignup={handleSignup} />
      )}
    </div>
  );
}

export default App;
