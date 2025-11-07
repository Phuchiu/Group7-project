// src/utils/tokenService.js
// Hoạt động 1: Quản lý Access Token và Refresh Token

/**
 * Token Service
 * Quản lý lưu trữ và truy xuất tokens từ localStorage
 */
const tokenService = {
  // Get tokens
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Set tokens
  setAccessToken: (token) => {
    localStorage.setItem('accessToken', token);
    console.log('✅ Access token saved:', token ? 'Yes' : 'No');
  },

  setRefreshToken: (token) => {
    localStorage.setItem('refreshToken', token);
    console.log('✅ Refresh token saved:', token ? 'Yes' : 'No');
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    console.log('✅ User saved:', user);
  },

  // Set all at once (sau khi login)
  setTokens: (accessToken, refreshToken, user) => {
    tokenService.setAccessToken(accessToken);
    tokenService.setRefreshToken(refreshToken);
    tokenService.setUser(user);
    console.log('💾 All tokens and user saved to localStorage');
  },

  // Clear tokens (logout)
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('🗑️ All tokens cleared');
  },

  // Check if has valid token
  hasAccessToken: () => {
    return !!tokenService.getAccessToken();
  },
};

export default tokenService;

/*
 * CÁCH DÙNG:
 * 
 * 1. Sau khi login:
 *    tokenService.setTokens(accessToken, refreshToken, user);
 * 
 * 2. Lấy token:
 *    const token = tokenService.getAccessToken();
 * 
 * 3. Logout:
 *    tokenService.clearTokens();
 * 
 * 4. Check logged in:
 *    if (tokenService.hasAccessToken()) { ... }
 */