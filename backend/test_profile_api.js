// 🧪 Script test nhanh API Profile
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Test data
const testUser = {
  email: 'test@example.com',
  password: '123456'
};

const updateData = {
  name: 'Updated Test User',
  email: 'updated@example.com',
  avatar: 'https://via.placeholder.com/150'
};

async function testProfileAPI() {
  console.log('🚀 Bắt đầu test API Profile...\n');

  try {
    // 1. Login để lấy token
    console.log('1️⃣ Testing Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, testUser);
    authToken = loginResponse.data.token;
    console.log('✅ Login thành công');
    console.log('📝 Token:', authToken.substring(0, 20) + '...\n');

    // 2. GET Profile
    console.log('2️⃣ Testing GET Profile...');
    const getProfileResponse = await axios.get(`${BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ GET Profile thành công');
    console.log('👤 User info:', {
      name: getProfileResponse.data.name,
      email: getProfileResponse.data.email,
      role: getProfileResponse.data.role
    });
    console.log('\n');

    // 3. PUT Profile
    console.log('3️⃣ Testing PUT Profile...');
    const updateResponse = await axios.put(`${BASE_URL}/api/profile`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ PUT Profile thành công');
    console.log('📝 Message:', updateResponse.data.message);
    console.log('👤 Updated user:', {
      name: updateResponse.data.user.name,
      email: updateResponse.data.user.email,
      avatar: updateResponse.data.user.avatar
    });
    console.log('\n');

    // 4. GET Profile sau khi update
    console.log('4️⃣ Testing GET Profile after update...');
    const getUpdatedResponse = await axios.get(`${BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ GET Profile sau update thành công');
    console.log('👤 Updated info:', {
      name: getUpdatedResponse.data.name,
      email: getUpdatedResponse.data.email,
      avatar: getUpdatedResponse.data.avatar
    });
    console.log('\n');

    // 5. Test lỗi - GET Profile không có token
    console.log('5️⃣ Testing GET Profile without token (should fail)...');
    try {
      await axios.get(`${BASE_URL}/api/profile`);
    } catch (error) {
      console.log('✅ Lỗi 401 như mong đợi:', error.response.data.message);
    }
    console.log('\n');

    // 6. Test lỗi - PUT Profile thiếu thông tin
    console.log('6️⃣ Testing PUT Profile with missing data (should fail)...');
    try {
      await axios.put(`${BASE_URL}/api/profile`, { name: '' }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      console.log('✅ Lỗi validation như mong đợi:', error.response.data.message);
    }

    console.log('\n🎉 Tất cả test cases đã hoàn thành!');
    console.log('📊 Kết quả: API Profile hoạt động đúng như mong đợi');

  } catch (error) {
    console.error('❌ Test thất bại:', error.response?.data || error.message);
  }
}

// Chạy test
if (require.main === module) {
  testProfileAPI();
}

module.exports = { testProfileAPI };