import React, { useState, useEffect } from 'react';

const AddUser = ({ onSubmit, editingUser, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Name không được để trống');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Email không hợp lệ');
      return;
    }

    onSubmit({ name, email });
    setName('');
    setEmail('');
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    onCancelEdit();
  };

  return (
    <div>
      <h2>{editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit">{editingUser ? 'Cập nhật' : 'Thêm'}</button>
        {editingUser && (
          <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>
            Hủy
          </button>
        )}
      </form>
    </div>
  );
};

export default AddUser;
