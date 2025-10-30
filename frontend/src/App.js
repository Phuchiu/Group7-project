import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';

const API_URL = 'http://localhost:3000/users';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (newUser) => {
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser.id || editingUser._id}`, newUser);
        setEditingUser(null);
      } else {
        await axios.post(API_URL, newUser);
      }
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => (user.id || user._id) !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management System</h1>
      <AddUser 
        onSubmit={handleAddUser} 
        editingUser={editingUser}
        onCancelEdit={handleCancelEdit}
      />
      <UserList 
        users={users} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
