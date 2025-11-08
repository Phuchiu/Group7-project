const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testReduxAPIs() {
  console.log('🧪 TESTING REDUX APIs...\n');
  
  try {
    // 1. Test Login
    console.log('1️⃣ Testing Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: '123456'
    });
    
    const { accessToken, user } = loginResponse.data;
    console.log('✅ Login successful');
    console.log('User:', user);
    console.log('Token:', accessToken.substring(0, 20) + '...\n');
    
    // 2. Test Verify Token
    console.log('2️⃣ Testing Verify Token...');
    const verifyResponse = await axios.get(`${BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    console.log('✅ Token verification successful');
    console.log('Verified User:', verifyResponse.data.user);
    console.log('\n');
    
    // 3. Test Protected Route
    console.log('3️⃣ Testing Protected Route (Get Users)...');
    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    console.log('✅ Protected route accessible');
    console.log('Users count:', usersResponse.data.count);
    console.log('\n');
    
    // 4. Test Refresh Token
    console.log('4️⃣ Testing Refresh Token...');
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: loginResponse.data.refreshToken
    });
    
    console.log('✅ Token refresh successful');
    console.log('New Token:', refreshResponse.data.accessToken.substring(0, 20) + '...\n');
    
    console.log('🎉 ALL REDUX APIs WORKING CORRECTLY!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Chạy test
testReduxAPIs();