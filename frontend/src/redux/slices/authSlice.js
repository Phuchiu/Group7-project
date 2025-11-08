// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://192.168.56.1:3002/api';

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token') || !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

// Async Thunks

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('🚀 Redux: Calling login API...');
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { user, token, accessToken, refreshToken } = response.data;

      // Lưu vào localStorage
      localStorage.setItem('user', JSON.stringify(user));
      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      } else if (token) {
        localStorage.setItem('token', token);
      }

      console.log('✅ Redux: Login successful');
      return { user, token, accessToken, refreshToken };
    } catch (error) {
      console.error('❌ Redux: Login failed', error);
      return rejectWithValue(
        error.response?.data?.message || 'Đăng nhập thất bại'
      );
    }
  }
);

// Register thunk
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      console.log('🚀 Redux: Calling register API...');
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      console.log('✅ Redux: Register successful');
      return response.data;
    } catch (error) {
      console.error('❌ Redux: Register failed', error);
      return rejectWithValue(
        error.response?.data?.message || 'Đăng ký thất bại'
      );
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk('auth/logout', async () => {
  console.log('🚪 Redux: Logging out...');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('✅ Redux: Logout complete');
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('⏳ Redux: Login pending...');
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token || action.payload.accessToken;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        console.log('✅ Redux: Login fulfilled');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        console.log('❌ Redux: Login rejected');
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('⏳ Redux: Register pending...');
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        console.log('✅ Redux: Register fulfilled');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('❌ Redux: Register rejected');
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      console.log('✅ Redux: Logout fulfilled');
    });
  },
});

export const { updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;