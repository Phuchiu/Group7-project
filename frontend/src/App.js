// src/App.js
import React, { useState } from 'react';
import AddUser from './components/AddUser';
import UserList from './components/UserList';
import './css/App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Callback khi user được thêm thành công
  const handleUserAdded = () => {
    // Trigger refresh của UserList bằng cách thay đổi key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>👥 User Management System</h1>
        <p>Quản lý người dùng với React & Node.js</p>
      </header>

      <main className="App-main">
        <AddUser onUserAdded={handleUserAdded} />
        <UserList key={refreshKey} />
      </main>

      <footer className="App-footer">
        <p>© 2025 GROUP7 | Buổi 4 - CRUD User Management</p>
      </footer>
    </div>
  );
}

export default App;