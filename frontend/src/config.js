// frontend/src/config.js
// API URL của backend (máy 192.168.56.1)

const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.56.1:3000/';

export default API_URL;

// CÁCH DÙNG trong component:
// import API_URL from '../config';
// axios.get(`${API_URL}/users`)
// axios.post(`${API_URL}/auth/login`, data)