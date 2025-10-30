import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setMessage('Đăng ký thành công!');
      onSignup(response.data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
          Đăng ký
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', color: message.includes('thành công') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default Signup;