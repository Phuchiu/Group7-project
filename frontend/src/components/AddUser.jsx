// src/components/AddUser.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AddUser({ onUserAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation đơn giản
    if (!name.trim() || !email.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('${process.env.REACT_APP_API_URL}/users', {
        name: name.trim(),
        email: email.trim()
      });

      // Clear form sau khi thêm thành công
      setName('');
      setEmail('');

      alert('Thêm user thành công!');

      // Gọi callback để refresh danh sách
      if (onUserAdded) {
        onUserAdded(response.data);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Lỗi khi thêm user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user">
      <h2>➕ Thêm User Mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên người dùng"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '⏳ Đang thêm...' : '✅ Thêm User'}
        </button>
      </form>
    </div>
  );
}

export default AddUser;