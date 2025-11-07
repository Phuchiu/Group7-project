// src/utils/axiosInstance.js
// Hoạt động 1: Axios instance với Auto Refresh Token interceptor

import axios from 'axios';
import tokenService from './tokenservice';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.56.1:3000/api';

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Thêm access token vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Request with token:', config.url);
    } else {
      console.log('📝 Request without token:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Auto refresh token khi 401
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log('⚠️ Response error:', {
      status: error.response?.status,
      url: originalRequest?.url,
      retry: originalRequest?._retry,
    });

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Access token expired, attempting refresh...');
        
        const refreshToken = tokenService.getRefreshToken();

        if (!refreshToken) {
          console.log('❌ No refresh token, logout required');
          throw new Error('No refresh token available');
        }

        // Gọi API refresh token
        console.log('🔄 Calling refresh token API...');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken } = response.data;

        console.log('✅ New access token received');

        // Lưu access token mới
        tokenService.setAccessToken(newAccessToken);

        // Update header của request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log('🔄 Retrying original request with new token...');

        // Retry request gốc với token mới
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error('❌ Refresh token failed:', refreshError);
        
        // Refresh token hết hạn → Logout
        tokenService.clearTokens();
        
        // Redirect về login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

/*
 * FLOW AUTO REFRESH TOKEN:
 * 
 * 1. User gọi API → axiosInstance tự động thêm access token vào header
 * 
 * 2. Nếu access token hết hạn → Backend trả về 401
 * 
 * 3. Interceptor bắt 401:
 *    - Lấy refresh token từ localStorage
 *    - Gọi API /auth/refresh để lấy access token mới
 *    - Lưu access token mới vào localStorage
 *    - Retry request gốc với token mới
 * 
 * 4. Nếu refresh token cũng hết hạn:
 *    - Clear tokens
 *    - Redirect về /login
 * 
 * CÁCH DÙNG:
 * 
 * import axiosInstance from '../utils/axiosInstance';
 * 
 * // Thay vì dùng axios thường:
 * // axios.get('http://...')
 * 
 * // Dùng axiosInstance:
 * axiosInstance.get('/profile')
 *   .then(res => console.log(res.data))
 *   .catch(err => console.error(err));
 * 
 * // Auto refresh token hoạt động tự động!
 */