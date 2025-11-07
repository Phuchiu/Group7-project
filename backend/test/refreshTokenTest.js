const mongoose = require('mongoose');
const RefreshToken = require('../models/RefreshToken');
const TokenService = require('../services/tokenService');
const User = require('../models/User');
require('dotenv').config();

// Test RefreshToken Schema và TokenService
async function testRefreshToken() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    await testUser.save();
    console.log('✅ Test user created:', testUser._id);

    // Test 2: Generate token pair
    const tokens = await TokenService.generateTokenPair(testUser);
    console.log('✅ Token pair generated:');
    console.log('- Access Token:', tokens.accessToken.substring(0, 50) + '...');
    console.log('- Refresh Token:', tokens.refreshToken.substring(0, 50) + '...');
    console.log('- Expires In:', tokens.expiresIn);

    // Test 3: Verify tokens
    const accessPayload = TokenService.verifyAccessToken(tokens.accessToken);
    console.log('✅ Access token verified:', accessPayload.email);

    const refreshPayload = TokenService.verifyRefreshToken(tokens.refreshToken);
    console.log('✅ Refresh token verified:', refreshPayload.email);

    // Test 4: Find refresh token in database
    const foundToken = await TokenService.findRefreshToken(tokens.refreshToken);
    console.log('✅ Refresh token found in DB:', foundToken ? 'Yes' : 'No');

    // Test 5: Test token revocation
    await TokenService.revokeRefreshToken(tokens.refreshToken);
    const revokedToken = await TokenService.findRefreshToken(tokens.refreshToken);
    console.log('✅ Token revoked successfully:', revokedToken ? 'No' : 'Yes');

    // Test 6: Test database cleanup
    const cleanupResult = await RefreshToken.cleanupRevoked();
    console.log('✅ Cleanup revoked tokens:', cleanupResult.deletedCount, 'deleted');

    // Cleanup test data
    await User.findByIdAndDelete(testUser._id);
    await RefreshToken.deleteMany({ userId: testUser._id });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All RefreshToken tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run tests
if (require.main === module) {
  testRefreshToken();
}

module.exports = testRefreshToken;