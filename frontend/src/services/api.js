import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... (Phần TokenManager giữ nguyên) ...
const TokenManager = {
  getAccessToken: () => sessionStorage.getItem('token') || localStorage.getItem('token'),
  getRefreshToken: () => sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken'),
  setTokens: (accessToken, refreshToken) => {
    sessionStorage.setItem('token', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  clearTokens: () => {
    sessionStorage.clear();
    localStorage.clear();
  }
};

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;
      try {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        console.log('🔄 Token expired, refreshing...');
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });

        const { accessToken } = response.data;
        TokenManager.setTokens(accessToken, refreshToken);
        console.log('✅ Token refreshed');

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log('❌ Session expired');
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