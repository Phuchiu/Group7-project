// frontend/src/config.js
// ⚠️ QUAN TRỌNG: Backend đang chạy ở 192.168.56.1:3000

// API URL của backend
const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.56.1:3000/api';

// Export default để dùng dễ dàng
export default API_URL;

// Export thêm các endpoint thường dùng
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: `${API_URL}/auth/signup`,
    LOGIN: `${API_URL}/auth/login`,
    LOGOUT: `${API_URL}/auth/logout`,
  },
  
  // User endpoints
  USERS: {
    GET_ALL: `${API_URL}/users`,
    GET_ONE: (id) => `${API_URL}/users/${id}`,
    CREATE: `${API_URL}/users`,
    UPDATE: (id) => `${API_URL}/users/${id}`,
    DELETE: (id) => `${API_URL}/users/${id}`,
    STATS: `${API_URL}/users/stats`,
  },
  
  // Profile endpoints
  PROFILE: {
    GET: `${API_URL}/profile`,
    UPDATE: `${API_URL}/profile`,
  }
};

// Helper function để tạo headers với token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Helper function để tạo headers cho upload file
export const getUploadHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

/* 
 * CÁCH DÙNG:
 * 
 * 1. Import API_URL:
 *    import API_URL from '../config';
 *    axios.post(`${API_URL}/auth/signup`, data);
 * 
 * 2. Import API_ENDPOINTS (recommended):
 *    import { API_ENDPOINTS, getAuthHeaders } from '../config';
 *    axios.post(API_ENDPOINTS.AUTH.SIGNUP, data);
 *    axios.get(API_ENDPOINTS.USERS.GET_ALL, { headers: getAuthHeaders() });
 * 
 * 3. Hoặc dùng direct:
 *    axios.post('http://192.168.56.1:3000/api/auth/signup', data);
 */

console.log('🔧 API Configuration loaded:');
console.log('📍 API Base URL:', API_URL);
console.log('🔑 Auth Signup:', API_ENDPOINTS.AUTH.SIGNUP);
console.log('🔑 Auth Login:', API_ENDPOINTS.AUTH.LOGIN);