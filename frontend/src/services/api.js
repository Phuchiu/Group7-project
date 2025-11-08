import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Token management
const TokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// Request interceptor - add access token
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 error and avoid infinite loops
    if (error.response?.status === 401 && 
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh')) {
      
      originalRequest._retry = true;
      
      try {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        console.log('🔄 Token expired, refreshing...');
        
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken
        });

        const { accessToken } = response.data;
        TokenManager.setTokens(accessToken, refreshToken);
        
        console.log('✅ Token refreshed successfully');
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        console.log('❌ Refresh failed, redirecting to login');
        TokenManager.clearTokens();
        window.location.reload();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api, TokenManager };
export default api;